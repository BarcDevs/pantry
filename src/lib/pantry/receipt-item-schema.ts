import { z } from 'zod'

import { UNITS } from '@/types/enums'

export const receiptItemShape = z.object({
    name: z.string(),
    quantity: z.number(),
    unit: z.enum(UNITS)
})

export const receiptItemsSchema = z.object({
    items: z.array(receiptItemShape)
})
