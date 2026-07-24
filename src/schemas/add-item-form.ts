import { z } from 'zod'

import {
    FOOD_TYPES,
    STORAGE_LOCATIONS,
    UNITS
} from '@/types/enums'

export const addItemFormSchema = z.object({
    name: z.string().trim().min(1).max(100),
    storage: z.enum(STORAGE_LOCATIONS),
    type: z.enum(FOOD_TYPES),
    quantity: z.number().positive(),
    unit: z.enum(UNITS),
    expiryDate: z.string(),
    notes: z.string().max(500)
})

export type AddItemFormValues = z.infer<
    typeof addItemFormSchema
>
