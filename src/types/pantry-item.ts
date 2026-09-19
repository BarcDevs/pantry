import type { MongoDbObject } from '@/types'
import type {
    FoodType,
    ItemSource,
    PantryUnit,
    StorageLocation } from '@/types/enums'

export type ExpiryEntry = {
    date: string
    reason: string
}

export type StorageSuggestion = {
    recognized: boolean
    suggestedStorage: StorageLocation
    suggestedType?: FoodType | null
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
    type: FoodType | null
    quantity: number
    unit: PantryUnit
    expiryDate?: Date
    notes?: string
    source: ItemSource
    storageSuggestion: StorageSuggestion | null
}

export type PantryItem = PantryItemDoc & MongoDbObject

export type AddPantryItemInput = {
    name: string
    emoji?: string
    storage: StorageLocation
    type: FoodType | null
    quantity: number
    unit: PantryUnit
    expiryDate?: Date
    notes?: string
    storageSuggestion?: StorageSuggestion | null
    source?: ItemSource
    mergeWithId?: string
    forceSeparate?: boolean
}

export type UpdatePantryItemInput = Partial<{
    name: string
    emoji: string
    storage: StorageLocation
    type: FoodType | null
    quantity: number
    unit: PantryUnit
    expiryDate: Date
    notes: string
    storageSuggestion: StorageSuggestion | null
}>

export type DeductRow = {
    pantryItemId: string
    name: string
    type: FoodType | null
    unit: PantryUnit
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

export type ExistingPantryItem = {
    _id: string
    name: string
    quantity: number
    unit: PantryUnit
}
