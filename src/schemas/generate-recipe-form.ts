import { z } from 'zod'

import {
    MATCH_STRICTNESSES,
    MEAL_TYPES,
    RECIPE_SCOPES
} from '@/types/enums'

import { spiceLevelSchema } from '@/schemas/recipe-doc-schema'

export const generateRecipeFormSchema = z.object({
    mealCount: z.number().int().positive(),
    maxTime: z.number().int().positive(),
    mealType: z.enum(MEAL_TYPES),
    scope: z.enum(RECIPE_SCOPES),
    allowAiGeneration: z.boolean(),
    matchStrictness: z.enum(MATCH_STRICTNESSES),
    maxSpiceLevel: spiceLevelSchema,
    customInstructions: z.string().max(500)
})

export type GenerateRecipeFormValues = z.infer<
    typeof generateRecipeFormSchema
>
