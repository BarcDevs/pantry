'use server'

import { z } from 'zod'

import type {
    RecipeDoc,
    RefineRecipeInput
} from '@/types/recipe'

import { generateStructured } from '@/lib/ai/gemini'
import { requireUserId } from '@/lib/auth/require-user-id'
import connectDB from '@/lib/mongodb'
import { buildRefineRecipePrompt } from '@/lib/prompts/refine-recipe-prompt'
import {
    normalizeIngredientFractions,
    normalizeStepFractions
} from '@/lib/recipes/normalize-fraction-words'
import type { MinimalPantryItem } from '@/lib/recipes/resolve-ingredient-pantry-status'
import { resolveIngredientPantryStatus } from '@/lib/recipes/resolve-ingredient-pantry-status'

import { ActionError } from '@/constants/errors'

import { PantryItemModel } from '@/models/pantry-item.model'
import { aiRecipeSchema } from '@/schemas/ai-recipe-schema'
import { recipeDocSchema } from '@/schemas/recipe-doc-schema'

export const refineRecipe = async (
    input: RefineRecipeInput
): Promise<RecipeDoc> => {
    const userId = await requireUserId()
    const recipe = recipeDocSchema.parse(input.recipe)
    if (recipe.userId !== userId) {
        throw new Error(ActionError.Forbidden)
    }
    const instruction = z.string().trim()
        .min(1).max(500).parse(input.instruction)

    const prompt = buildRefineRecipePrompt(recipe, instruction)
    const refined = await generateStructured(
        prompt,
        aiRecipeSchema,
        () => ({
            title: `${recipe.title} (מעודכן)`,
            difficulty: recipe.difficulty,
            emoji: recipe.emoji ?? '🍳',
            ingredients: recipe.ingredients,
            steps: recipe.steps
        })
    )

    await connectDB()
    const pantryItems = await PantryItemModel
        .find({ userId })
        .lean<MinimalPantryItem[]>()

    return {
        ...recipe,
        title: refined.title,
        difficulty: refined.difficulty,
        emoji: refined.emoji,
        ingredients: resolveIngredientPantryStatus(
            normalizeIngredientFractions(refined.ingredients),
            pantryItems
        ),
        steps: normalizeStepFractions(refined.steps)
    }
}
