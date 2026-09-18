import { z } from 'zod'

import {
    FOOD_TYPES,
    PANTRY_UNITS,
    STORAGE_LOCATIONS
} from '@/types/enums'

import { storageSuggestionSchema } from '@/schemas/storage-suggestion-schema'

export const pantryItemNameSchema = z.string().trim().min(1).max(100)

export const pantryItemBaseSchema = z.object({
    name: pantryItemNameSchema,
    emoji: z.string().max(8).optional(),
    storage: z.enum(STORAGE_LOCATIONS),
    type: z.enum(FOOD_TYPES).nullable(),
    quantity: z.number().positive(),
    unit: z.enum(PANTRY_UNITS),
    expiryDate: z.date().optional(),
    notes: z.string().max(500).optional(),
    storageSuggestion: storageSuggestionSchema
})
