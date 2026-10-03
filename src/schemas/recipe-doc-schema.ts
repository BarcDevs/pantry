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
import type { SpiceLevel } from '@/types/recipe'

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
    replacementName: z.string().optional(),
    replacementOptions: z.array(z.string()).optional()
})

export const stepSchema = z.object({
    order: z.number(),
    description: z.string()
})

export const spiceLevelSchema = z.union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3)
])

/**
 * Only for schemas passed to Gemini as a structured-output `schema` (AI
 * generation/import response shapes) - Gemini's response schema only
 * accepts string enum values, so the literal-number union above serializes
 * to an invalid schema (TYPE_STRING expected for enum, got a number). This
 * bounded integer avoids the enum entirely; the 0-3 range is still enforced
 * by min/max. Not for form/action-input validation - use spiceLevelSchema
 * there.
 */
export const aiSpiceLevelSchema = z.number().int().min(0).max(3) as z.ZodType<SpiceLevel>

export const aiPromptContextSchema = z.object({
    mealCount: z.number().int().positive(),
    maxTime: z.number().int().positive(),
    mealType: z.enum(MEAL_TYPES),
    scope: z.enum(RECIPE_SCOPES),
    allowAiGeneration: z.boolean(),
    matchStrictness: z.enum(MATCH_STRICTNESSES),
    maxSpiceLevel: spiceLevelSchema,
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
    sourceName: z.string().trim().max(100).optional(),
    difficulty: z.enum(DIFFICULTIES),
    spiceLevel: spiceLevelSchema,
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
