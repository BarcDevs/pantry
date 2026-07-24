import { z } from 'zod'

import { STORAGE_LOCATIONS } from '@/types/enums'

const expiryEntrySchema = z.object({
    date: z.string(),
    reason: z.string()
})

export const storageSuggestionSchema = z.object({
    suggestedStorage: z.enum(STORAGE_LOCATIONS),
    reason: z.string(),
    expiryByStorage: z.object({
        fridge: expiryEntrySchema,
        freezer: expiryEntrySchema,
        pantry: expiryEntrySchema
    })
}).nullish()
