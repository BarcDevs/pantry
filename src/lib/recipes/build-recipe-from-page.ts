import type {
    FetchedPage,
    PageRecipeResult
} from '@/types/recipe'

import { generateStructured } from '@/lib/ai/gemini'
import { buildImportRecipeFromUrlPrompt } from '@/lib/prompts/import-recipe-from-url-prompt'
import { buildImportedRecipeDoc } from '@/lib/recipes/build-imported-recipe-doc'
import { extractRecipeImage } from '@/lib/recipes/extract-recipe-image'
import { extractRecipeSourceName } from '@/lib/recipes/extract-recipe-source-name'
import { importedRecipeFallback } from '@/lib/recipes/imported-recipe-fallback'
import type { MinimalPantryItem } from '@/lib/recipes/resolve-ingredient-pantry-status'

import {
    importedRecipeSchema,
    webImportedRecipeSchema
} from '@/schemas/imported-recipe-schema'

export const buildRecipeFromPage = async (
    input: {
        userId: string
        pageUrl: string
        page: FetchedPage
        pantryItems: MinimalPantryItem[]
        requestedDish?: string
        timeoutMs?: number
        signal?: AbortSignal
    }
): Promise<PageRecipeResult> => {
    const generated = await generateStructured(
        buildImportRecipeFromUrlPrompt(
            input.page.pageText,
            input.pantryItems.map((item) => item.name),
            input.requestedDish
        ),
        input.requestedDish
            ? webImportedRecipeSchema
            : importedRecipeSchema,
        importedRecipeFallback,
        0,
        undefined,
        {
            timeoutMs: input.timeoutMs,
            signal: input.signal
        }
    )

    if (generated.ingredients.length === 0 || generated.steps.length === 0) {
        return { status: 'failed' }
    }

    return {
        status: 'ok',
        matchesRequestedDish: (generated as { matchesRequestedDish?: boolean })
            .matchesRequestedDish,
        recipe: buildImportedRecipeDoc(
            input.userId,
            generated,
            input.pantryItems,
            {
                sourceUrl: input.pageUrl,
                sourceName: extractRecipeSourceName(
                    input.page.html,
                    input.pageUrl
                ),
                imageUrl: extractRecipeImage(input.page.html, input.pageUrl)
            }
        )
    }
}
