import type { Unit } from '@/types/enums'

export type ScannedReceiptItem = {
    name: string
    quantity: number
    unit: Unit
}

export type ImageInput = {
    base64: string
    mimeType: string
}
