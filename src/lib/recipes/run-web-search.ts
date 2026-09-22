import type { RecipeDoc } from '@/types/recipe'

import type { FindWebRecipeInput } from '@/lib/recipes/find-web-recipe'
import { findWebRecipe } from '@/lib/recipes/find-web-recipe'
import { createSearchClient } from '@/lib/search/create-search-client'

import env from '@/config/env'

export type WebSearchOutcome = {
    recipe: RecipeDoc | null
    searchAttempted: boolean
}

/**
 * Runs the web-first search pipeline, or returns a fixture when
 * E2E_MOCK_SEARCH=true - mirrors `generateStructured`'s mock() pattern (see
 * src/lib/ai/gemini.ts) so e2e/unit tests can exercise the "found via
 * search" state without a real You.com call or page fetch. `searchAttempted`
 * is false only when no search client is configured (missing
 * YOUCOM_API_KEY) - the caller falls back to AI generation or "search
 * unavailable" on that, same as before this wrapper existed.
 */
export const runWebSearch = async (
    input: FindWebRecipeInput,
    mock?: () => RecipeDoc | null
): Promise<WebSearchOutcome> => {
    if (env.e2eMockSearch) {
        if (!mock) {
            throw new Error(
                'runWebSearch called without a mock while E2E_MOCK_SEARCH=true'
            )
        }
        return {
            recipe: mock(),
            searchAttempted: true
        }
    }

    const searchClient = createSearchClient()
    if (!searchClient) return {
        recipe: null,
        searchAttempted: false
    }

    const recipe = await findWebRecipe(input, { searchClient })
    return {
        recipe,
        searchAttempted: true
    }
}
