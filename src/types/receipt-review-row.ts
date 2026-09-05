import type { PantryUnit } from '@/types/enums'

export type ReceiptReviewRow = {
    id: string
    name: string
    quantity: number
    unit: PantryUnit
    included: boolean
}
