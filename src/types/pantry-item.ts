import type { MongoDbObject } from '@/types'
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

export type PantryItem = PantryItemDoc & MongoDbObject

export type AddPantryItemInput = {
    name: string
    storage: StorageLocation
    type: FoodType
    quantity: number
    unit: Unit
    expiryDate?: Date
    notes?: string
    storageSuggestion?: StorageSuggestion | null
    mergeWithId?: string
    forceSeparate?: boolean
}

export type UpdatePantryItemInput = Partial<{
    name: string
    storage: StorageLocation
    type: FoodType
    quantity: number
    unit: Unit
    expiryDate: Date
    notes: string
    storageSuggestion: StorageSuggestion | null
}>

export type DeductRow = {
    pantryItemId: string
    name: string
    emoji?: string
    unit: Unit
    pantryQty: number
    used: number
    choice: 'keep' | 'delete' | null
}

export type DeductPantryItemEdit = {
    id: string
    newQuantity: number
    remove?: boolean
}

export type AddPantryItemOutcome =
    | { status: 'created', item: PantryItem }
    | {
        status: 'duplicate'
        existing: PantryItem
        incoming: AddPantryItemInput
    }
