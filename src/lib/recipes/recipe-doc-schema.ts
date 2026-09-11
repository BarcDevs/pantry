import { z } from 'zod'

import {
    COOKING_UNITS,
    DIFFICULTIES,
    FOOD_TYPES,
    MATCH_STRICTNESSES,
    MEAL_TYPES,
    RECIPE_SCOPES,
    RECIPE_SOURCES
} from '@/types/enums'

export const quantitySchema = z.union([
    z.number(),
    z.string().regex(/^\d+(\.\d+)?-\d+(\.\d+)?$/, 'Quantity range must be like "8-10"'),
    z.string().regex(/^\d+(\.\d+)?$/).transform(Number)
])

/** What the AI is allowed to produce - `name`/`inPantry` are always code-derived, never AI input. */
export const aiIngredientSchema = z.object({
    label: z.string(),
    category: z.enum(FOOD_TYPES),
    quantity: quantitySchema,
    unit: z.enum(COOKING_UNITS),
    optional: z.boolean().default(false)
})

export const ingredientSchema = aiIngredientSchema.extend({
    name: z.string(),
    inPantry: z.boolean(),
    replacementName: z.string().optional()
})

export const stepSchema = z.object({
    order: z.number(),
    description: z.string()
})

export const aiPromptContextSchema = z.object({
    mealCount: z.number().int().positive(),
    maxTime: z.number().int().positive(),
    mealType: z.enum(MEAL_TYPES),
    scope: z.enum(RECIPE_SCOPES),
    allowAiGeneration: z.boolean(),
    matchStrictness: z.enum(MATCH_STRICTNESSES),
    customInstructions: z.string().optional(),
    pantrySnapshot: z.array(z.string())
})

export const httpUrlSchema = z.string().url('כתובת לא תקינה').refine(
    (url) => ['http:', 'https:'].includes(new URL(url).protocol),
    'יש להזין כתובת http/https בלבד'
)

export const recipeDocSchema = z.object({
    userId: z.string(),
    title: z.string(),
    source: z.enum(RECIPE_SOURCES),
    sourceUrl: httpUrlSchema.optional(),
    difficulty: z.enum(DIFFICULTIES),
    maxTime: z.number().int().positive(),
    mealCount: z.number().int().positive(),
    mealType: z.enum(MEAL_TYPES),
    ingredients: z.array(ingredientSchema),
    steps: z.array(stepSchema),
    emoji: z.string().optional(),
    imageUrl: httpUrlSchema.optional(),
    rating: z.number().min(1).max(5).nullable(),
    history: z.array(z.object({
        entryId: z.string(),
        cookedAt: z.coerce.date(),
        rating: z.number().min(1).max(5).nullable()
    })),
    isFavorite: z.boolean(),
    tags: z.array(z.string()),
    aiPromptContext: aiPromptContextSchema.nullable()
})
