import type {
    FetchedPage,
    PageRecipeResult
} from '@/types/recipe'

import { generateStructured } from '@/lib/ai/gemini'
import { buildImportRecipeFromUrlPrompt } from '@/lib/prompts/import-recipe-from-url-prompt'
import { buildImportedRecipeDoc } from '@/lib/recipes/build-imported-recipe-doc'
import { extractOgImage } from '@/lib/recipes/extract-og-image'
import { importedRecipeFallback } from '@/lib/recipes/imported-recipe-fallback'
import type { MinimalPantryItem } from '@/lib/recipes/resolve-ingredient-pantry-status'

import { importedRecipeSchema } from '@/schemas/imported-recipe-schema'

export const buildRecipeFromPage = async (
    input: {
        userId: string
        pageUrl: string
        page: FetchedPage
        pantryItems: MinimalPantryItem[]
    }
): Promise<PageRecipeResult> => {
    const generated = await generateStructured(
        buildImportRecipeFromUrlPrompt(
            input.page.pageText,
            input.pantryItems.map((item) => item.name)
        ),
        importedRecipeSchema,
        importedRecipeFallback,
        0
    )

    if (generated.ingredients.length === 0 || generated.steps.length === 0) {
        return { status: 'failed' }
    }

    return {
        status: 'ok',
        recipe: buildImportedRecipeDoc(
            input.userId,
            generated,
            input.pantryItems,
            {
                sourceUrl: input.pageUrl,
                imageUrl: extractOgImage(input.page.html, input.pageUrl)
            }
        )
    }
}
