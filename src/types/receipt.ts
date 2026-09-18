import type { PantryUnit } from '@/types/enums'

export type ScannedReceiptItem = {
    name: string
    quantity: number
    unit: PantryUnit
}

export type ImageInput = {
    base64: string
    mimeType: string
}

export type ParseReceiptUrlResult = {
    items: ScannedReceiptItem[]
    fallbackToManual: boolean
    isBlocked: boolean
}
