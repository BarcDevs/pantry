import { z } from 'zod'

import {
    DIFFICULTIES,
    MATCH_STRICTNESSES,
    MEAL_TYPES,
    RECIPE_SCOPES,
    RECIPE_SOURCES,
    UNITS
} from '@/types/enums'

export const ingredientSchema = z.object({
    name: z.string(),
    quantity: z.number(),
    unit: z.enum(UNITS),
    inPantry: z.boolean()
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

export const httpUrlSchema = z.string().url().refine(
    (url) => ['http:', 'https:'].includes(new URL(url).protocol),
    'Only http/https URLs are allowed'
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
