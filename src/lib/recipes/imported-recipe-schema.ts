import { z } from 'zod'

import {
    COOKING_UNITS,
    DIFFICULTIES,
    MEAL_TYPES
} from '@/types/enums'

import { quantitySchema } from '@/lib/recipes/recipe-doc-schema'

export const importedRecipeSchema = z.object({
    title: z.string(),
    difficulty: z.enum(DIFFICULTIES),
    mealType: z.enum(MEAL_TYPES),
    mealCount: z.number().int().positive(),
    maxTime: z.number().int().positive(),
    emoji: z.string(),
    ingredients: z.array(z.object({
        name: z.string(),
        baseName: z.string(),
        quantity: quantitySchema,
        unit: z.enum(COOKING_UNITS),
        optional: z.boolean().default(false)
    })),
    steps: z.array(z.object({
        order: z.number(),
        description: z.string()
    }))
})

export type ImportedRecipe = z.infer<typeof importedRecipeSchema>
