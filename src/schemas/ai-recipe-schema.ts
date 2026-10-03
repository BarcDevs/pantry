import { z } from 'zod'

import { DIFFICULTIES } from '@/types/enums'

import {
    aiIngredientSchema,
    aiSpiceLevelSchema,
    stepSchema
} from './recipe-doc-schema'

export const aiRecipeSchema = z.object({
    title: z.string(),
    difficulty: z.enum(DIFFICULTIES),
    spiceLevel: aiSpiceLevelSchema,
    emoji: z.string(),
    ingredients: z.array(aiIngredientSchema),
    steps: z.array(stepSchema)
})
