import { z } from 'zod'

import { PANTRY_UNITS } from '@/types/enums'

export const receiptItemShape = z.object({
    name: z.string().min(1).max(120),
    quantity: z.number().positive().max(10_000),
    unit: z.enum(PANTRY_UNITS)
})

export const receiptItemsSchema = z.object({
    items: z.array(receiptItemShape).max(200)
})
