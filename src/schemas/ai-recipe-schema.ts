import { z } from 'zod'

import { DIFFICULTIES } from '@/types/enums'

import {
    aiIngredientSchema,
    stepSchema
} from './recipe-doc-schema'

export const aiRecipeSchema = z.object({
    title: z.string(),
    difficulty: z.enum(DIFFICULTIES),
    emoji: z.string(),
    ingredients: z.array(aiIngredientSchema),
    steps: z.array(stepSchema)
})
