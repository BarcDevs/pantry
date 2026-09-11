'use server'

import { z } from 'zod'

import type { RecipeImportResult } from '@/types/recipe'

import { generateStructured } from '@/lib/ai/gemini'
import { requireUserId } from '@/lib/auth/require-user-id'
import connectDB from '@/lib/mongodb'
import { fetchPageText } from '@/lib/network/fetch-page-text'
import { buildImportRecipeFromUrlPrompt } from '@/lib/prompts/import-recipe-from-url-prompt'
import { buildImportedRecipeDoc } from '@/lib/recipes/build-imported-recipe-doc'
import { extractOgImage } from '@/lib/recipes/extract-og-image'
import { importedRecipeFallback } from '@/lib/recipes/imported-recipe-fallback'
import { importedRecipeSchema } from '@/lib/recipes/imported-recipe-schema'
import type { MinimalPantryItem } from '@/lib/recipes/resolve-ingredient-pantry-status'

import { PantryItemModel } from '@/models/pantry-item.model'

export const importRecipeFromUrl = async (
    url: string
): Promise<RecipeImportResult> => {
    const userId = await requireUserId()
    const parsedUrl = z.string().url().parse(url)

    const fetched = await fetchPageText(parsedUrl)
    if (fetched === null) {
        return {
            recipe: null,
            fallbackToManual: true
        }
    }

    await connectDB()
    const pantryItems = await PantryItemModel
        .find({ userId })
        .lean<MinimalPantryItem[]>()

    const generated = await generateStructured(
        buildImportRecipeFromUrlPrompt(
            fetched.pageText,
            pantryItems.map((item) => item.name)
        ),
        importedRecipeSchema,
        importedRecipeFallback,
        0
    )

    const recipe = buildImportedRecipeDoc(userId, generated, pantryItems, {
        sourceUrl: parsedUrl,
        imageUrl: extractOgImage(fetched.html)
    })

    return {
        recipe,
        fallbackToManual: false
    }
}
