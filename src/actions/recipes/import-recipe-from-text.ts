'use server'

import { z } from 'zod'

import type { RecipeImportResult } from '@/types/recipe'

import { generateStructured } from '@/lib/ai/gemini'
import { requireUserId } from '@/lib/auth/require-user-id'
import connectDB from '@/lib/mongodb'
import { buildImportRecipeFromTextPrompt } from '@/lib/prompts/import-recipe-from-text-prompt'
import { buildImportedRecipeDoc } from '@/lib/recipes/build-imported-recipe-doc'
import { importedRecipeFallback } from '@/lib/recipes/imported-recipe-fallback'
import { importedRecipeSchema } from '@/lib/recipes/imported-recipe-schema'
import { httpUrlSchema } from '@/lib/recipes/recipe-doc-schema'
import type { MinimalPantryItem } from '@/lib/recipes/resolve-ingredient-pantry-status'

import { PantryItemModel } from '@/models/pantry-item.model'

export const importRecipeFromText = async (
    text: string,
    imageUrl?: string
): Promise<RecipeImportResult> => {
    const userId = await requireUserId()
    const parsedText = z
        .string()
        .trim()
        .min(1)
        .max(20_000)
        .parse(text)
    const parsedImageUrl = httpUrlSchema
        .optional()
        .parse(imageUrl)

    const generated = await generateStructured(
        buildImportRecipeFromTextPrompt(parsedText),
        importedRecipeSchema,
        importedRecipeFallback,
        0
    )

    await connectDB()
    const pantryItems = await PantryItemModel
        .find({ userId })
        .lean<MinimalPantryItem[]>()

    const recipe = buildImportedRecipeDoc(userId, generated, pantryItems, {
        imageUrl: parsedImageUrl
    })

    return {
        recipe,
        fallbackToManual: false
    }
}
