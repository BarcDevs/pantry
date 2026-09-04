import type { Unit } from '@/types/enums'

export type ReceiptReviewRow = {
    id: string
    name: string
    quantity: number
    unit: Unit
    included: boolean
}
