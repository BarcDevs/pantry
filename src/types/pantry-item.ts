import type {
    FoodType,
    ItemSource,
    StorageLocation,
    Unit
} from '@/types/enums'

export type ExpiryEntry = {
    date: string
    reason: string
}

export type StorageSuggestion = {
    suggestedStorage: StorageLocation
    reason: string
    expiryByStorage: {
        fridge: ExpiryEntry
        freezer: ExpiryEntry
        pantry: ExpiryEntry
    }
}

export type PantryItemDoc = {
    id: string
    userId: string
    name: string
    emoji?: string
    storage: StorageLocation
    type: FoodType
    quantity: number
    unit: Unit
    expiryDate?: Date
    notes?: string
    source: ItemSource
    storageSuggestion: StorageSuggestion | null
}
