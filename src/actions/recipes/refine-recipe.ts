'use server'

import { z } from 'zod'

import {
    DIFFICULTIES,
    MEAL_TYPES,
    RECIPE_SOURCES,
    UNITS
} from '@/types/enums'
import type {
    AiPromptContext,
    RecipeDoc,
    RefineRecipeInput
} from '@/types/recipe'

import { generateStructured } from '@/lib/ai/gemini'
import { requireUserId } from '@/lib/auth/require-user-id'

const ingredientSchema = z.object({
    name: z.string(),
    quantity: z.number(),
    unit: z.enum(UNITS),
    inPantry: z.boolean()
})

const stepSchema = z.object({
    order: z.number(),
    description: z.string()
})

const refinedRecipeSchema = z.object({
    title: z.string(),
    difficulty: z.enum(DIFFICULTIES),
    emoji: z.string(),
    ingredients: z.array(ingredientSchema),
    steps: z.array(stepSchema)
})

const recipeDocSchema = z.object({
    userId: z.string(),
    title: z.string(),
    source: z.enum(RECIPE_SOURCES),
    sourceUrl: z.string().optional(),
    difficulty: z.enum(DIFFICULTIES),
    maxTime: z.number().int().positive(),
    mealCount: z.number().int().positive(),
    mealType: z.enum(MEAL_TYPES),
    ingredients: z.array(ingredientSchema),
    steps: z.array(stepSchema),
    emoji: z.string().optional(),
    imageUrl: z.string().optional(),
    rating: z.number().min(1).max(5).nullable(),
    history: z.array(z.object({
        entryId: z.string(),
        cookedAt: z.date(),
        rating: z.number().min(1).max(5).nullable()
    })),
    isFavorite: z.boolean(),
    tags: z.array(z.string()),
    aiPromptContext: z.unknown().nullable()
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
    const recipe = recipeDocSchema.parse(input.recipe) as (
        Omit<RecipeDoc, 'aiPromptContext'>
        & { aiPromptContext: AiPromptContext | null }
    )
    if (recipe.userId !== userId) {
        throw new Error('Forbidden')
    }
    const instruction = z.string().trim()
        .min(1).max(500).parse(input.instruction)

    const prompt = buildPrompt(recipe, instruction)
    const refined = await generateStructured(
        prompt,
        refinedRecipeSchema
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
