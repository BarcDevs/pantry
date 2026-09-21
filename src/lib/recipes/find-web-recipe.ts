import type {
    GenerateRecipeInput,
    PageRecipeResult,
    RecipeDoc
} from '@/types/recipe'

import type { PageFetchResult } from '@/lib/network/fetch-page-text'
import { fetchPageText } from '@/lib/network/fetch-page-text'
import { buildRecipeSearchQuery } from '@/lib/prompts/build-recipe-search-query'
import { buildRecipeFromPage } from '@/lib/recipes/build-recipe-from-page'
import { judgeWebRecipe } from '@/lib/recipes/judge-web-recipe'
import type { MinimalPantryItem } from '@/lib/recipes/resolve-ingredient-pantry-status'
import { composeEnglishSearchQuery } from '@/lib/search/compose-english-search-query'
import type { Deadline } from '@/lib/search/create-deadline'
import { createDeadline } from '@/lib/search/create-deadline'
import { selectSearchIngredients } from '@/lib/search/select-search-ingredients'
import type { RecipeSearchClient } from '@/lib/search/types'

import {
    aiStructuringTimeoutMs,
    candidateFetchTimeoutMs,
    hebrewStageBudgetMs,
    maxCandidatesPerStage,
    minBudgetForEnglishStageMs,
    queryTranslationTimeoutMs,
    SearchLanguage,
    searchRequestTimeoutMs,
    webSearchBudgetMs
} from '@/constants/search'

export type FindWebRecipeInput = {
    request: GenerateRecipeInput
    userId: string
    selectedPantryItems: MinimalPantryItem[]
    allPantryItems: MinimalPantryItem[]
}

export type FindWebRecipeDeps = {
    searchClient: RecipeSearchClient
    fetchPage?: (
        url: string,
        options: {
            deadlineMs: number
            signal: AbortSignal
        }
    ) => Promise<PageFetchResult>
    buildRecipe?: (
        input: Parameters<typeof buildRecipeFromPage>[0]
    ) => Promise<PageRecipeResult>
    composeEnglishQuery?: typeof composeEnglishSearchQuery
    now?: () => number
}

type StageContext = {
    input: FindWebRecipeInput
    deps: Required<FindWebRecipeDeps>
    /** Bounds this stage; itself never longer than what the whole phase has left. */
    deadline: Deadline
    seenUrls: Set<string>
}

const logFailure = (step: string, error: unknown): void => {
    console.error(
        `[findWebRecipe] ${step} failed: ${error instanceof Error ? error.message : 'unknown error'}`
    )
}

/** Fetch, parse and judge one page. Never throws: any failure means "not qualified". */
const evaluateCandidate = async (
    context: StageContext,
    url: string,
    signal: AbortSignal
): Promise<RecipeDoc | null> => {
    const { input, deps, deadline } = context
    try {
        const page = await deps.fetchPage(url, {
            deadlineMs: deadline.clip(candidateFetchTimeoutMs),
            signal
        })
        if (
            page.status !== 'ok'
            || signal.aborted
            || !deadline.canStart()
        ) return null

        const built = await deps.buildRecipe({
            userId: input.userId,
            pageUrl: page.finalUrl,
            page,
            pantryItems: input.allPantryItems,
            timeoutMs: deadline.clip(aiStructuringTimeoutMs),
            signal
        })
        if (built.status !== 'ok' || signal.aborted) return null

        const isQualified = judgeWebRecipe(
            built.recipe,
            input.request,
            input.allPantryItems
        )
        return isQualified ? built.recipe : null
    } catch (error) {
        if (!signal.aborted) logFailure('candidate', error)
        return null
    }
}

/**
 * Evaluates all candidates in parallel but picks deterministically: the
 * best-ranked (search order) qualifying one, returned as soon as every
 * higher-ranked candidate has finished. Losers are aborted.
 */
const pickBestCandidate = async (
    context: StageContext,
    urls: string[]
): Promise<RecipeDoc | null> => {
    const controller = new AbortController()
    const evaluations = urls.map((url) => evaluateCandidate(
        context,
        url,
        controller.signal
    ))
    try {
        for (const evaluation of evaluations) {
            const recipe = await evaluation
            if (recipe) return recipe
        }
        return null
    } finally {
        controller.abort()
    }
}

/** Throws when the search itself fails; failing candidates are just skipped. */
const runStage = async (
    context: StageContext,
    query: string,
    language: SearchLanguage
): Promise<RecipeDoc | null> => {
    const { deps, deadline, seenUrls } = context
    const results = await deps.searchClient.search(query, {
        language,
        timeoutMs: deadline.clip(searchRequestTimeoutMs)
    })
    const urls = results
        .map((result) => result.url)
        .filter((url) => !seenUrls.has(url))
        .slice(0, maxCandidatesPerStage)
    urls.forEach((url) => seenUrls.add(url))
    if (urls.length === 0 || !deadline.canStart()) return null
    return pickBestCandidate(context, urls)
}

/**
 * Looks for a recipe on the web that satisfies the request. Stage 1 searches
 * in Hebrew (capped at `hebrewStageBudgetMs`); if nothing qualifies and at
 * least `minBudgetForEnglishStageMs` remains, stage 2 searches with an English
 * query composed by one AI call. Within a stage up to `maxCandidatesPerStage`
 * pages are evaluated in parallel. The whole phase is a hard
 * `webSearchBudgetMs` ceiling: every awaited step gets min(its own cap,
 * remaining budget) and nothing new starts when too little is left. Any error
 * means "nothing found" (null). The returned recipe's `sourceUrl` is the
 * fetched page's final URL, never the search-result URL.
 */
export const findWebRecipe = async (
    input: FindWebRecipeInput,
    deps: FindWebRecipeDeps
): Promise<RecipeDoc | null> => {
    const resolvedDeps: Required<FindWebRecipeDeps> = {
        fetchPage: fetchPageText,
        buildRecipe: buildRecipeFromPage,
        composeEnglishQuery: composeEnglishSearchQuery,
        now: Date.now,
        ...deps
    }
    const phase = createDeadline(webSearchBudgetMs, resolvedDeps.now)
    const seenUrls = new Set<string>()

    try {
        const hebrewHit = await runStage(
            {
                input,
                deps: resolvedDeps,
                deadline: createDeadline(
                    phase.clip(hebrewStageBudgetMs),
                    resolvedDeps.now
                ),
                seenUrls
            },
            buildRecipeSearchQuery(
                input.request.mealType,
                input.selectedPantryItems
            ),
            SearchLanguage.Hebrew
        )
        if (hebrewHit) return hebrewHit
        if (phase.remainingMs() < minBudgetForEnglishStageMs) return null

        const englishQuery = await resolvedDeps.composeEnglishQuery(
            input.request,
            selectSearchIngredients(input.selectedPantryItems),
            phase.clip(queryTranslationTimeoutMs)
        )
        if (!phase.canStart()) return null
        return await runStage(
            {
                input,
                deps: resolvedDeps,
                deadline: createDeadline(
                    phase.remainingMs(),
                    resolvedDeps.now
                ),
                seenUrls
            },
            englishQuery,
            SearchLanguage.English
        )
    } catch (error) {
        logFailure('search', error)
        return null
    }
}
