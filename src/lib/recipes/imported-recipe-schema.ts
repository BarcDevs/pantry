import { z } from 'zod'

import {
    DIFFICULTIES,
    MEAL_TYPES,
    UNITS
} from '@/types/enums'

export const importedRecipeSchema = z.object({
    title: z.string(),
    difficulty: z.enum(DIFFICULTIES),
    mealType: z.enum(MEAL_TYPES),
    mealCount: z.number().int().positive(),
    maxTime: z.number().int().positive(),
    emoji: z.string(),
    ingredients: z.array(z.object({
        name: z.string(),
        quantity: z.number(),
        unit: z.enum(UNITS)
    })),
    steps: z.array(z.object({
        order: z.number(),
        description: z.string()
    }))
})

export type ImportedRecipe = z.infer<typeof importedRecipeSchema>
