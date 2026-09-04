import { Unit } from '@/types/enums'
import type { ScannedReceiptItem } from '@/types/receipt'

export const mockReceiptItems = (): { items: ScannedReceiptItem[] } => ({
    items: [
        {
            name: 'עגבניות',
            quantity: 1,
            unit: Unit.Kg
        }
    ]
})
