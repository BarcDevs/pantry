import { z } from 'zod'

import {
    FOOD_TYPES,
    PANTRY_UNITS,
    STORAGE_LOCATIONS } from '@/types/enums'

import { pantryTexts } from '@/constants/texts/pantry'

export const addItemFormSchema = z.object({
    name: z.string().trim().min(1).max(100),
    storage: z.enum(STORAGE_LOCATIONS),
    type: z.enum(FOOD_TYPES).nullable(),
    quantity: z.number().positive({ message: pantryTexts.addForm.quantityError }),
    unit: z.enum(PANTRY_UNITS),
    expiryDate: z.string(),
    notes: z.string().max(500)
})

export type AddItemFormValues = z.infer<
    typeof addItemFormSchema
>
