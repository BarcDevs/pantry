import type {
    FoodType,
    PantryUnit,
    StorageLocation
} from '@/types/enums'
import type { StorageSuggestion } from '@/types/pantry-item'

export type ReceiptReviewRow = {
    id: string
    name: string
    quantity: number
    unit: PantryUnit
    storage: StorageLocation
    type: FoodType | null
    expiryDate: string
    storageSuggestion: StorageSuggestion | null
    included: boolean
}

export type ReceiptReviewRowEditPatch = {
    name: string
    storage: StorageLocation
    type: FoodType | null
    expiryDate: string
    storageSuggestion: StorageSuggestion | null
}

export type ReceiptReviewRowActions = {
    onToggle: (id: string) => void
    onQuantityChange: (id: string, quantity: number) => void
    onUnitChange: (id: string, unit: PantryUnit) => void
    onEditSave: (id: string, patch: ReceiptReviewRowEditPatch) => void
    onRemove: (id: string) => void
}
