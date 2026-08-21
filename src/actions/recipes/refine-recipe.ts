'use server'

import { z } from 'zod'

import { DIFFICULTIES } from '@/types/enums'
import type {
    RecipeDoc,
    RefineRecipeInput
} from '@/types/recipe'

import { generateStructured } from '@/lib/ai/gemini'
import { requireUserId } from '@/lib/auth/require-user-id'
import {
    ingredientSchema,
    recipeDocSchema,
    stepSchema
} from '@/lib/recipes/recipe-doc-schema'

const refinedRecipeSchema = z.object({
    title: z.string(),
    difficulty: z.enum(DIFFICULTIES),
    emoji: z.string(),
    ingredients: z.array(ingredientSchema),
    steps: z.array(stepSchema)
})

const buildPrompt = (
    recipe: RecipeDoc,
    instruction: string
): string => `
    להלן מתכון קיים בעברית בפורמט JSON:
    ${JSON.stringify({
        title: recipe.title,
        ingredients: recipe.ingredients,
        steps: recipe.steps
    })}
    עדכן את המתכון לפי ההוראה הבאה מהמשתמש: "${instruction}".
    שמור על מספר המנות ועל זמן ההכנה הכולל ככל האפשר,
    אלא אם ההוראה דורשת אחרת.
    לכל מרכיב ציין אם הוא נמצא במזווה (inPantry).
    בחר אימוג'י יחיד המייצג את המתכון המעודכן.
`

export const refineRecipe = async (
    input: RefineRecipeInput
): Promise<RecipeDoc> => {
    const userId = await requireUserId()
    const recipe = recipeDocSchema.parse(input.recipe)
    if (recipe.userId !== userId) {
        throw new Error('Forbidden')
    }
    const instruction = z.string().trim()
        .min(1).max(500).parse(input.instruction)

    const prompt = buildPrompt(recipe, instruction)
    const refined = await generateStructured(
        prompt,
        refinedRecipeSchema,
        () => ({
            title: `${recipe.title} (מעודכן)`,
            difficulty: recipe.difficulty,
            emoji: recipe.emoji ?? '🍳',
            ingredients: recipe.ingredients,
            steps: recipe.steps
        })
    )

    return {
        ...recipe,
        title: refined.title,
        difficulty: refined.difficulty,
        emoji: refined.emoji,
        ingredients: refined.ingredients,
        steps: refined.steps
    }
}
