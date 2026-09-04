'use server'

import { z } from 'zod'

import type { RecipeImportResult } from '@/types/recipe'

import { generateStructured } from '@/lib/ai/gemini'
import { requireUserId } from '@/lib/auth/require-user-id'
import { buildImportRecipeFromTextPrompt } from '@/lib/prompts/import-recipe-from-text-prompt'
import { buildImportedRecipeDoc } from '@/lib/recipes/build-imported-recipe-doc'
import { importedRecipeFallback } from '@/lib/recipes/imported-recipe-fallback'
import { importedRecipeSchema } from '@/lib/recipes/imported-recipe-schema'

export const importRecipeFromText = async (
    text: string
): Promise<RecipeImportResult> => {
    const userId = await requireUserId()
    const parsedText = z
        .string()
        .trim()
        .min(1)
        .max(20_000)
        .parse(text)

    const generated = await generateStructured(
        buildImportRecipeFromTextPrompt(parsedText),
        importedRecipeSchema,
        importedRecipeFallback,
        0
    )

    const recipe = buildImportedRecipeDoc(userId, generated)

    return {
        recipe,
        fallbackToManual: false
    }
}
