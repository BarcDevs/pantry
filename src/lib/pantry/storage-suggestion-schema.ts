import { z } from 'zod'

import {
    FOOD_TYPES,
    STORAGE_LOCATIONS
} from '@/types/enums'

const expiryEntrySchema = z.object({
    date: z.string(),
    reason: z.string()
})

export const storageSuggestionShape = z.object({
    suggestedStorage: z.enum(STORAGE_LOCATIONS),
    suggestedType: z.enum(FOOD_TYPES).nullish(),
    reason: z.string(),
    expiryByStorage: z.object({
        fridge: expiryEntrySchema,
        freezer: expiryEntrySchema,
        pantry: expiryEntrySchema
    })
})

export const storageSuggestionSchema = storageSuggestionShape.nullish()
