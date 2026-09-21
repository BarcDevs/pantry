/**
 * @jest-environment node
 */
jest.mock('@/lib/ai/gemini', () => ({
    generateStructured: jest.fn()
}))

import {
    CookingUnit,
    FoodType,
    MatchStrictness
} from '@/types/enums'
import type { RecipeDoc } from '@/types/recipe'

import type { PageFetchResult } from '@/lib/network/fetch-page-text'

import {
    aiStructuringTimeoutMs,
    candidateFetchTimeoutMs,
    conversionTimeoutMs,
    hebrewStageBudgetMs,
    maxCandidatesPerStage,
    minBudgetForEnglishStageMs,
    queryTranslationTimeoutMs,
    SearchLanguage,
    searchRequestTimeoutMs,
    webSearchBudgetMs
} from '@/constants/search'
import { secondInMs } from '@/constants/time'

import type { FindWebRecipeInput } from './find-web-recipe'
import { findWebRecipe } from './find-web-recipe'

const pantryItem = {
    name: 'עוף',
    type: FoodType.Meat,
    quantity: 1,
    unit: 'units' as const
}

const input: FindWebRecipeInput = {
    request: {
        mealCount: 2,
        maxTime: 30,
        mealType: 'dinner',
        scope: 'pantry-first',
        allowAiGeneration: true,
        matchStrictness: MatchStrictness.Flexible
    },
    userId: 'user_1',
    selectedPantryItems: [pantryItem],
    allPantryItems: [pantryItem]
}

const okPage = (finalUrl: string): PageFetchResult => ({
    status: 'ok',
    pageText: 'text',
    html: '<html></html>',
    finalUrl
})

const recipeDoc = (overrides: Partial<RecipeDoc> = {}): RecipeDoc => ({
    title: 'r',
    maxTime: 20,
    mealCount: 2,
    mealType: 'dinner',
    ingredients: [{
        label: 'עוף',
        name: 'עוף',
        category: FoodType.Meat,
        quantity: 1,
        unit: CookingUnit.Units,
        inPantry: true,
        optional: false
    }],
    ...overrides
} as RecipeDoc)

const built = (overrides: Partial<RecipeDoc> = {}) => ({
    status: 'ok',
    recipe: recipeDoc(overrides)
})

const searchResults = (...urls: string[]) => urls.map((url) => ({
    url,
    title: url
}))

const deferred = <T>() => {
    let resolve!: (value: T) => void
    let reject!: (reason: unknown) => void
    const promise = new Promise<T>((done, fail) => {
        resolve = done
        reject = fail
    })
    return {
        promise,
        resolve,
        reject
    }
}

const setup = () => {
    const state = { clock: 0 }
    const search = jest.fn()
    const fetchPage = jest.fn()
    const buildRecipe = jest.fn()
    const composeEnglishQuery = jest.fn().mockResolvedValue('chicken dinner')
    const convertServings = jest.fn(async (recipe: RecipeDoc, mealCount: number) => ({
        ...recipe,
        mealCount
    }))
    const runWith = (request: FindWebRecipeInput) => findWebRecipe(request, {
        searchClient: { search },
        fetchPage,
        buildRecipe,
        composeEnglishQuery,
        convertServings,
        now: () => state.clock
    })
    const run = () => runWith(input)
    return {
        state,
        convertServings,
        search,
        fetchPage,
        buildRecipe,
        composeEnglishQuery,
        run,
        runWith
    }
}

describe('findWebRecipe', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => undefined)
    })
    afterEach(() => jest.restoreAllMocks())

    it('searches for the requested dish instead of the pantry ingredients', async () => {
        const t = setup()
        t.search.mockResolvedValue(searchResults('https://a.co.il/r'))
        t.fetchPage.mockResolvedValue(okPage('https://a.co.il/r'))
        t.buildRecipe.mockResolvedValue(built({ sourceUrl: 'https://a.co.il/r' }))

        await t.runWith({
            ...input,
            request: {
                ...input.request,
                customInstructions: '  פד תאי '
            }
        })

        expect(t.search.mock.calls[0][0]).toMatch(/^מתכון פד תאי /)
    })

    describe('requested dish match', () => {
        const dishInput = {
            ...input,
            request: {
                ...input.request,
                customInstructions: 'לזניה'
            }
        }

        it('rejects a mismatching higher-ranked page and lets the next matching one win', async () => {
            const t = setup()
            t.search.mockResolvedValue(searchResults('https://a.com/1', 'https://a.com/2'))
            t.fetchPage.mockImplementation(async (url: string) => okPage(url))
            t.buildRecipe.mockImplementation(async ({ pageUrl }: { pageUrl: string }) => ({
                ...built({ sourceUrl: pageUrl }),
                matchesRequestedDish: pageUrl.endsWith('/2')
            }))

            const result = await t.runWith(dishInput)

            expect(result?.sourceUrl).toBe('https://a.com/2')
            expect(t.buildRecipe.mock.calls[0][0].requestedDish).toBe('לזניה')
        })

        it('treats a missing flag as a mismatch and goes on to the English stage with the same dish', async () => {
            const t = setup()
            t.search
                .mockResolvedValueOnce(searchResults('https://a.com/1'))
                .mockResolvedValueOnce(searchResults('https://b.com/1'))
            t.fetchPage.mockImplementation(async (url: string) => okPage(url))
            t.buildRecipe.mockImplementation(async ({ pageUrl }: { pageUrl: string }) => (
                pageUrl.includes('a.com')
                    ? built({ sourceUrl: pageUrl })
                    : {
                        ...built({ sourceUrl: pageUrl }),
                        matchesRequestedDish: true
                    }
            ))

            const result = await t.runWith(dishInput)

            expect(result?.sourceUrl).toBe('https://b.com/1')
            expect(t.search.mock.calls[1][1].language).toBe(SearchLanguage.English)
            expect(t.buildRecipe).toHaveBeenCalledTimes(2)
            expect(t.buildRecipe.mock.calls[1][0].requestedDish).toBe('לזניה')
        })

        it('returns null when every candidate mismatches the dish', async () => {
            const t = setup()
            t.search.mockResolvedValue(searchResults('https://a.com/1'))
            t.fetchPage.mockImplementation(async (url: string) => okPage(url))
            t.buildRecipe.mockImplementation(async ({ pageUrl }: { pageUrl: string }) => ({
                ...built({ sourceUrl: pageUrl }),
                matchesRequestedDish: false
            }))

            expect(await t.runWith(dishInput)).toBeNull()
        })

        it('is unaffected without a dish: no requestedDish, flag ignored', async () => {
            const t = setup()
            t.search.mockResolvedValue(searchResults('https://a.com/1'))
            t.fetchPage.mockImplementation(async (url: string) => okPage(url))
            t.buildRecipe.mockImplementation(async ({ pageUrl }: { pageUrl: string }) => ({
                ...built({ sourceUrl: pageUrl }),
                matchesRequestedDish: false
            }))

            const result = await t.run()

            expect(result?.sourceUrl).toBe('https://a.com/1')
            expect(t.buildRecipe.mock.calls[0][0].requestedDish).toBeUndefined()
        })
    })

    it('returns the qualifying Hebrew hit with the fetched final url, not the search url', async () => {
        const t = setup()
        t.search.mockResolvedValue(searchResults('https://a.co.il/r'))
        t.fetchPage.mockResolvedValue(okPage('https://a.co.il/canonical'))
        t.buildRecipe.mockResolvedValue(built({ sourceUrl: 'https://a.co.il/canonical' }))

        const result = await t.run()

        expect(result?.sourceUrl).toBe('https://a.co.il/canonical')
        expect(t.search).toHaveBeenCalledTimes(1)
        expect(t.search.mock.calls[0][0]).toBe('מתכון ערב עוף')
        expect(t.search.mock.calls[0][1].language).toBe(SearchLanguage.Hebrew)
        expect(t.buildRecipe.mock.calls[0][0].pageUrl).toBe('https://a.co.il/canonical')
        expect(t.composeEnglishQuery).not.toHaveBeenCalled()
    })

    it('skips blocked (402) and unqualified candidates and takes a later qualifying one', async () => {
        const t = setup()
        t.search.mockResolvedValue(searchResults(
            'https://a.com/1',
            'https://a.com/2',
            'https://a.com/3'
        ))
        t.fetchPage.mockImplementation(async (url: string) => (
            url.endsWith('/1')
                ? { status: 'blocked' }
                : okPage(url)
        ))
        t.buildRecipe.mockImplementation(async ({ pageUrl }: { pageUrl: string }) => (
            pageUrl.endsWith('/2')
                ? built({ maxTime: 90 })
                : built({ sourceUrl: pageUrl })
        ))

        expect((await t.run())?.sourceUrl).toBe('https://a.com/3')
    })

    it('evaluates at most maxCandidatesPerStage candidates per stage, all started in parallel', async () => {
        const t = setup()
        t.search.mockResolvedValue(searchResults(
            ...Array.from(
                { length: maxCandidatesPerStage + 1 },
                (_, index) => `https://a.com/${index + 1}`
            )
        ))
        const gate = deferred<PageFetchResult>()
        t.fetchPage.mockReturnValue(gate.promise)

        const running = t.run()
        await new Promise((done) => setImmediate(done))

        expect(t.fetchPage).toHaveBeenCalledTimes(maxCandidatesPerStage)
        gate.resolve({ status: 'failed' })
        await running
    })

    it('goes to the English stage after a Hebrew miss and returns its hit', async () => {
        const t = setup()
        t.search
            .mockResolvedValueOnce(searchResults('https://a.co.il/1'))
            .mockResolvedValueOnce(searchResults('https://b.com/1'))
        t.fetchPage.mockImplementation(async (url: string) => (
            url.includes('a.co.il')
                ? { status: 'failed' }
                : okPage(url)
        ))
        t.buildRecipe.mockResolvedValue(built({ sourceUrl: 'https://b.com/1' }))

        const result = await t.run()

        expect(result?.sourceUrl).toBe('https://b.com/1')
        expect(t.search.mock.calls[1][0]).toBe('chicken dinner')
        expect(t.search.mock.calls[1][1].language).toBe(SearchLanguage.English)
    })

    it('returns null when both stages miss', async () => {
        const t = setup()
        t.search
            .mockResolvedValueOnce(searchResults('https://a.com/1'))
            .mockResolvedValueOnce(searchResults('https://b.com/1'))
        t.fetchPage.mockResolvedValue({ status: 'failed' })

        expect(await t.run()).toBeNull()
        expect(t.search).toHaveBeenCalledTimes(2)
    })

    it('never fetches or returns a page listed in excludeUrls (host and path, ignoring scheme, www, query)', async () => {
        const t = setup()
        t.search.mockResolvedValue(searchResults(
            'https://www.a.co.il/shown/?utm=1',
            'https://a.co.il/fresh'
        ))
        t.fetchPage.mockImplementation(async (url: string) => okPage(url))
        t.buildRecipe.mockImplementation(async ({ pageUrl }: { pageUrl: string }) => (
            built({ sourceUrl: pageUrl })
        ))

        const result = await t.runWith({
            ...input,
            request: {
                ...input.request,
                excludeUrls: ['http://a.co.il/shown']
            }
        })

        expect(result?.sourceUrl).toBe('https://a.co.il/fresh')
        expect(t.fetchPage).toHaveBeenCalledTimes(1)
        expect(t.fetchPage.mock.calls[0][0]).toBe('https://a.co.il/fresh')
    })

    it('rejects a candidate whose final url after a redirect is an excluded page', async () => {
        const t = setup()
        t.search.mockResolvedValue(searchResults('https://short.co/x'))
        t.fetchPage.mockResolvedValue(okPage('https://a.co.il/shown'))
        t.buildRecipe.mockResolvedValue(built({ sourceUrl: 'https://a.co.il/shown' }))
        t.search.mockResolvedValueOnce(searchResults('https://short.co/x'))
        t.search.mockResolvedValueOnce([])

        const result = await t.runWith({
            ...input,
            request: {
                ...input.request,
                excludeUrls: ['https://a.co.il/shown']
            }
        })

        expect(result).toBeNull()
        expect(t.buildRecipe).not.toHaveBeenCalled()
    })

    it('does not retry a url already tried in the previous stage', async () => {
        const t = setup()
        t.search.mockResolvedValue(searchResults('https://a.com/1'))
        t.fetchPage.mockResolvedValue({ status: 'failed' })

        await t.run()

        expect(t.fetchPage).toHaveBeenCalledTimes(1)
    })

    it('returns null without logging payloads when the search throws', async () => {
        const t = setup()
        t.search.mockRejectedValue(new Error('Search request failed with status 500'))

        expect(await t.run()).toBeNull()
        expect(t.fetchPage).not.toHaveBeenCalled()
        expect(t.composeEnglishQuery).not.toHaveBeenCalled()
        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining('status 500')
        )
    })

    it('returns null when the English translation throws', async () => {
        const t = setup()
        t.search.mockResolvedValue(searchResults('https://a.com/1'))
        t.fetchPage.mockResolvedValue({ status: 'failed' })
        t.composeEnglishQuery.mockRejectedValue(new Error('ai down'))

        expect(await t.run()).toBeNull()
    })

    describe('parallel candidates', () => {
        it('a lower-ranked candidate finishing first never beats a higher-ranked qualifying one', async () => {
            const t = setup()
            t.search.mockResolvedValue(searchResults(
                'https://a.com/1',
                'https://a.com/2'
            ))
            const first = deferred<PageFetchResult>()
            t.fetchPage.mockImplementation((url: string) => (
                url.endsWith('/1')
                    ? first.promise
                    : Promise.resolve(okPage(url))
            ))
            t.buildRecipe.mockImplementation(async ({ pageUrl }: { pageUrl: string }) =>
                built({ sourceUrl: pageUrl }))

            const running = t.run()
            await new Promise((done) => setImmediate(done))
            expect(t.buildRecipe).toHaveBeenCalledTimes(1)
            first.resolve(okPage('https://a.com/1'))

            expect((await running)?.sourceUrl).toBe('https://a.com/1')
        })

        it('falls to a lower-ranked candidate when every higher-ranked one fails', async () => {
            const t = setup()
            t.search.mockResolvedValue(searchResults(
                'https://a.com/1',
                'https://a.com/2'
            ))
            const first = deferred<PageFetchResult>()
            t.fetchPage.mockImplementation((url: string) => (
                url.endsWith('/1')
                    ? first.promise
                    : Promise.resolve(okPage(url))
            ))
            t.buildRecipe.mockImplementation(async ({ pageUrl }: { pageUrl: string }) =>
                built({ sourceUrl: pageUrl }))

            const running = t.run()
            await new Promise((done) => setImmediate(done))
            first.resolve({ status: 'failed' })

            expect((await running)?.sourceUrl).toBe('https://a.com/2')
        })

        it('aborts the still-running losers once a winner is returned', async () => {
            const t = setup()
            t.search.mockResolvedValue(searchResults(
                'https://a.com/1',
                'https://a.com/2',
                'https://a.com/3'
            ))
            const signals: Record<string, AbortSignal> = {}
            t.fetchPage.mockImplementation((url: string, options: { signal: AbortSignal }) => {
                signals[url] = options.signal
                return url.endsWith('/1')
                    ? Promise.resolve(okPage(url))
                    : new Promise(() => undefined)
            })
            t.buildRecipe.mockResolvedValue(built({ sourceUrl: 'https://a.com/1' }))

            const result = await t.run()

            expect(result?.sourceUrl).toBe('https://a.com/1')
            expect(signals['https://a.com/2'].aborted).toBe(true)
            expect(signals['https://a.com/3'].aborted).toBe(true)
        })

        it('a candidate that throws does not affect the others', async () => {
            const t = setup()
            t.search.mockResolvedValue(searchResults(
                'https://a.com/1',
                'https://a.com/2'
            ))
            t.fetchPage.mockImplementation(async (url: string) => okPage(url))
            t.buildRecipe.mockImplementation(async ({ pageUrl }: { pageUrl: string }) => {
                if (pageUrl.endsWith('/1')) throw new Error('ai timeout')
                return built({ sourceUrl: pageUrl })
            })

            expect((await t.run())?.sourceUrl).toBe('https://a.com/2')
        })
    })

    describe('a higher-ranked candidate fails while a lower-ranked one succeeds', () => {
        const flush = () => new Promise((done) => setImmediate(done))

        const track = <T>(promise: Promise<T>) => {
            const state = { settled: false }
            promise.then(() => {
                state.settled = true
            })
            return state
        }

        type FirstOutcome = {
            name: string
            request?: Partial<FindWebRecipeInput['request']>
            release: (gate: ReturnType<typeof deferred<PageFetchResult>>) => void
            first: () => unknown
        }

        const missingIngredient = (optional: boolean) => [{
            label: 'סלמון',
            name: 'סלמון',
            category: FoodType.Fish,
            quantity: 1,
            unit: CookingUnit.Units,
            inPantry: false,
            optional
        }]

        const outcomes: FirstOutcome[] = [
            {
                name: '(a) fetch is blocked (401/402/403/429 -> FetchBlockedError)',
                release: (gate) => gate.resolve({ status: 'blocked' }),
                first: () => built()
            },
            {
                name: '(a) fetch throws',
                release: (gate) => gate.reject(new Error('network down')),
                first: () => built()
            },
            {
                name: '(b) fetch times out',
                release: (gate) => gate.resolve({ status: 'failed' }),
                first: () => built()
            },
            {
                name: '(c) structuring returns failed (no ingredients or steps)',
                release: (gate) => gate.resolve(okPage('https://a.com/1')),
                first: () => ({ status: 'failed' })
            },
            {
                name: '(d) rejected by maxTime',
                release: (gate) => gate.resolve(okPage('https://a.com/1')),
                first: () => built({ maxTime: 90 })
            },
            {
                name: '(e) rejected by the flexible pantry match (core ingredient missing)',
                release: (gate) => gate.resolve(okPage('https://a.com/1')),
                first: () => built({ ingredients: missingIngredient(false) })
            },
            {
                name: '(e) rejected by the strict pantry match (optional ingredient missing)',
                request: { matchStrictness: MatchStrictness.Strict },
                release: (gate) => gate.resolve(okPage('https://a.com/1')),
                first: () => built({ ingredients: missingIngredient(true) })
            },
            {
                name: '(f) throws an unexpected error',
                release: (gate) => gate.resolve(okPage('https://a.com/1')),
                first: () => {
                    throw new Error('unexpected')
                }
            }
        ]

        it.each(outcomes)('$name: the lower-ranked winner is held until it finishes', async (outcome) => {
            const t = setup()
            t.search.mockResolvedValue(searchResults(
                'https://a.com/1',
                'https://a.com/2'
            ))
            const gate = deferred<PageFetchResult>()
            t.fetchPage.mockImplementation((url: string) => (
                url.endsWith('/1')
                    ? gate.promise
                    : Promise.resolve(okPage(url))
            ))
            t.buildRecipe.mockImplementation(async ({ pageUrl }: { pageUrl: string }) => {
                if (pageUrl.endsWith('/1')) return outcome.first()
                return built({ sourceUrl: pageUrl })
            })

            const running = findWebRecipe(
                {
                    ...input,
                    request: {
                        ...input.request,
                        ...outcome.request
                    }
                },
                {
                    searchClient: { search: t.search },
                    fetchPage: t.fetchPage,
                    buildRecipe: t.buildRecipe,
                    composeEnglishQuery: t.composeEnglishQuery,
                    now: () => t.state.clock
                }
            )
            const state = track(running)
            await flush()
            expect(state.settled).toBe(false)

            outcome.release(gate)

            expect((await running)?.sourceUrl).toBe('https://a.com/2')
        })

        const threeCandidates = () => {
            const t = setup()
            t.search.mockResolvedValue(searchResults(
                'https://a.com/1',
                'https://a.com/2',
                'https://a.com/3'
            ))
            const second = deferred<PageFetchResult>()
            t.fetchPage.mockImplementation((url: string) => {
                if (url.endsWith('/1')) return Promise.resolve({ status: 'failed' })
                if (url.endsWith('/2')) return second.promise
                return Promise.resolve(okPage(url))
            })
            t.buildRecipe.mockImplementation(async ({ pageUrl }: { pageUrl: string }) =>
                built({ sourceUrl: pageUrl }))
            const running = t.run()
            return {
                t,
                second,
                running,
                state: track(running)
            }
        }

        it('#1 fails, #2 pending, #3 qualifies first: #3 is held, then wins when #2 fails', async () => {
            const { t, second, running, state } = threeCandidates()
            await flush()
            expect(t.buildRecipe).toHaveBeenCalledTimes(1)
            expect(state.settled).toBe(false)

            second.resolve({ status: 'failed' })

            expect((await running)?.sourceUrl).toBe('https://a.com/3')
        })

        it('#1 fails, #2 pending, #3 qualifies first: #3 is held, then #2 wins when it qualifies', async () => {
            const { second, running, state } = threeCandidates()
            await flush()
            expect(state.settled).toBe(false)

            second.resolve(okPage('https://a.com/2'))

            expect((await running)?.sourceUrl).toBe('https://a.com/2')
        })

        it('all three fail: the stage yields nothing and the English stage runs', async () => {
            const t = setup()
            t.search
                .mockResolvedValueOnce(searchResults(
                    'https://a.com/1',
                    'https://a.com/2',
                    'https://a.com/3'
                ))
                .mockResolvedValueOnce(searchResults('https://b.com/x'))
            t.fetchPage.mockImplementation(async (url: string) => {
                if (url.endsWith('/1')) return { status: 'blocked' }
                if (url.endsWith('/2')) return { status: 'failed' }
                return okPage(url)
            })
            t.buildRecipe.mockImplementation(async ({ pageUrl }: { pageUrl: string }) => {
                if (pageUrl.includes('b.com')) return built({ sourceUrl: pageUrl })
                return { status: 'failed' }
            })

            const result = await t.run()

            expect(t.composeEnglishQuery).toHaveBeenCalledTimes(1)
            expect(t.search).toHaveBeenCalledTimes(2)
            expect(result?.sourceUrl).toBe('https://b.com/x')
        })

        it('all three fail in both stages: nothing is returned (caller falls back)', async () => {
            const t = setup()
            t.search
                .mockResolvedValueOnce(searchResults(
                    'https://a.com/1',
                    'https://a.com/2',
                    'https://a.com/3'
                ))
                .mockResolvedValueOnce(searchResults(
                    'https://b.com/1',
                    'https://b.com/2',
                    'https://b.com/3'
                ))
            t.fetchPage.mockResolvedValue({ status: 'failed' })

            expect(await t.run()).toBeNull()
            expect(t.fetchPage).toHaveBeenCalledTimes(6)
        })
    })

    describe('servings conversion', () => {
        const hit = async (
            t: ReturnType<typeof setup>,
            overrides: Partial<RecipeDoc> = {}
        ) => {
            t.search.mockResolvedValue(searchResults('https://a.com/1'))
            t.fetchPage.mockResolvedValue(okPage('https://a.com/1'))
            t.buildRecipe.mockResolvedValue(built({
                sourceUrl: 'https://a.com/1',
                ...overrides
            }))
            return t.run()
        }

        it('does not call the AI when the servings already match', async () => {
            const t = setup()

            const result = await hit(t)

            expect(t.convertServings).not.toHaveBeenCalled()
            expect(result?.mealCount).toBe(2)
        })

        it('converts to the requested servings and sets the requested meal type', async () => {
            const t = setup()

            const result = await hit(t, {
                mealCount: 4,
                mealType: 'lunch'
            })

            expect(t.convertServings).toHaveBeenCalledTimes(1)
            expect(t.convertServings.mock.calls[0][1]).toBe(2)
            expect(t.convertServings.mock.calls[0][2]).toEqual([pantryItem])
            expect(t.convertServings.mock.calls[0][3]).toBe(conversionTimeoutMs)
            expect(result?.mealCount).toBe(2)
            expect(result?.mealType).toBe('dinner')
            expect(result?.sourceUrl).toBe('https://a.com/1')
        })

        it('keeps the recipe unconverted when the conversion throws', async () => {
            const t = setup()
            t.convertServings.mockRejectedValue(new Error('ai timeout'))

            const result = await hit(t, { mealCount: 4 })

            expect(result?.mealCount).toBe(4)
            expect(result?.mealType).toBe('dinner')
            expect(console.error).toHaveBeenCalledWith(
                expect.stringContaining('servings conversion')
            )
        })

        it('clips the conversion timeout to the remaining budget', async () => {
            const t = setup()
            t.search.mockResolvedValue(searchResults('https://a.com/1'))
            t.fetchPage.mockResolvedValue(okPage('https://a.com/1'))
            t.buildRecipe.mockImplementation(async () => {
                t.state.clock = webSearchBudgetMs - 3 * secondInMs
                return built({ mealCount: 4 })
            })

            await t.run()

            expect(t.convertServings.mock.calls[0][3]).toBe(3 * secondInMs)
        })

        it('skips the conversion when the budget is nearly exhausted', async () => {
            const t = setup()
            t.search.mockResolvedValue(searchResults('https://a.com/1'))
            t.fetchPage.mockResolvedValue(okPage('https://a.com/1'))
            t.buildRecipe.mockImplementation(async () => {
                t.state.clock = webSearchBudgetMs - 500
                return built({ mealCount: 4 })
            })

            const result = await t.run()

            expect(t.convertServings).not.toHaveBeenCalled()
            expect(result?.mealCount).toBe(4)
        })
    })

    describe('time budget', () => {
        it('gives each step its own cap while plenty of budget remains', async () => {
            const t = setup()
            t.search.mockResolvedValue(searchResults('https://a.com/1'))
            t.fetchPage.mockResolvedValue(okPage('https://a.com/1'))
            t.buildRecipe.mockResolvedValue({ status: 'failed' })

            await t.run()

            expect(t.search.mock.calls[0][1].timeoutMs).toBe(searchRequestTimeoutMs)
            expect(t.fetchPage.mock.calls[0][1].deadlineMs).toBe(candidateFetchTimeoutMs)
            expect(t.buildRecipe.mock.calls[0][0].timeoutMs).toBe(aiStructuringTimeoutMs)
        })

        it('clips a slow AI parse near the Hebrew stage deadline', async () => {
            const t = setup()
            t.search.mockResolvedValue(searchResults('https://a.com/1'))
            t.fetchPage.mockImplementation(async (url: string) => {
                t.state.clock = 6 * secondInMs
                return okPage(url)
            })
            t.buildRecipe.mockResolvedValue({ status: 'failed' })

            await t.run()

            expect(t.buildRecipe.mock.calls[0][0].timeoutMs).toBe(
                hebrewStageBudgetMs - 6 * secondInMs
            )
        })

        it('caps the Hebrew stage at its own budget even though the whole phase has more', async () => {
            const t = setup()
            t.search.mockImplementation(async () => {
                t.state.clock = 7 * secondInMs
                return searchResults('https://a.com/1')
            })
            t.fetchPage.mockResolvedValue({ status: 'failed' })

            await t.run()

            expect(t.fetchPage.mock.calls[0][1].deadlineMs).toBe(
                hebrewStageBudgetMs - 7 * secondInMs
            )
            expect(webSearchBudgetMs - 7 * secondInMs).toBeGreaterThan(
                hebrewStageBudgetMs - 7 * secondInMs
            )
        })

        it('starts nothing new when the Hebrew stage budget is used up by the search', async () => {
            const t = setup()
            t.search.mockImplementation(async () => {
                t.state.clock = hebrewStageBudgetMs
                return searchResults('https://a.com/1')
            })

            expect(await t.run()).toBeNull()
            expect(t.fetchPage).not.toHaveBeenCalled()
        })

        it('skips the English stage when less than the minimum budget remains', async () => {
            const t = setup()
            t.search.mockResolvedValue(searchResults('https://a.com/1'))
            t.fetchPage.mockImplementation(async () => {
                t.state.clock = webSearchBudgetMs - minBudgetForEnglishStageMs + 1
                return { status: 'failed' }
            })

            expect(await t.run()).toBeNull()
            expect(t.composeEnglishQuery).not.toHaveBeenCalled()
            expect(t.search).toHaveBeenCalledTimes(1)
        })

        it('runs the English stage with exactly the minimum budget left, every step clipped to it', async () => {
            const t = setup()
            t.search
                .mockResolvedValueOnce(searchResults('https://a.com/1'))
                .mockResolvedValueOnce(searchResults('https://b.com/1'))
            t.fetchPage.mockImplementation(async (url: string) => {
                if (url.includes('a.com')) {
                    t.state.clock = hebrewStageBudgetMs
                    return { status: 'failed' }
                }
                return okPage(url)
            })
            t.composeEnglishQuery.mockImplementation(async () => {
                t.state.clock += 4 * secondInMs
                return 'chicken dinner'
            })
            t.buildRecipe.mockResolvedValue({ status: 'failed' })

            await t.run()

            expect(t.composeEnglishQuery.mock.calls[0][2]).toBe(queryTranslationTimeoutMs)
            expect(t.search.mock.calls[1][1].timeoutMs).toBe(
                webSearchBudgetMs - hebrewStageBudgetMs - 4 * secondInMs
            )
            expect(t.fetchPage.mock.calls[1][1].deadlineMs).toBeLessThanOrEqual(
                webSearchBudgetMs - hebrewStageBudgetMs - 4 * secondInMs
            )
        })

        it('never lets any step exceed the overall ceiling', async () => {
            const t = setup()
            t.search
                .mockImplementationOnce(async () => {
                    t.state.clock = hebrewStageBudgetMs - secondInMs
                    return searchResults('https://a.com/1')
                })
                .mockImplementationOnce(async () => {
                    t.state.clock += secondInMs
                    return searchResults('https://b.com/1')
                })
            t.fetchPage.mockImplementation(async (url: string, options: { deadlineMs: number }) => {
                expect(t.state.clock + options.deadlineMs).toBeLessThanOrEqual(webSearchBudgetMs)
                t.state.clock += options.deadlineMs
                return { status: 'failed' }
            })
            t.composeEnglishQuery.mockImplementation(async (
                _request: unknown,
                _ingredients: unknown,
                timeoutMs: number
            ) => {
                expect(t.state.clock + timeoutMs).toBeLessThanOrEqual(webSearchBudgetMs)
                t.state.clock += timeoutMs
                return 'q'
            })

            await t.run()

            expect(t.state.clock).toBeLessThanOrEqual(webSearchBudgetMs)
        })
    })
})
