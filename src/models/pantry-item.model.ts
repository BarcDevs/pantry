import mongoose from 'mongoose'

import {
    FOOD_TYPES,
    ITEM_SOURCES,
    ItemSource,
    STORAGE_LOCATIONS,
    UNITS
} from '@/types/enums'
import type {
    PantryItemDoc,
    StorageSuggestion
} from '@/types/pantry-item'

const expiryEntrySchema = {
    date: { type: String, required: true },
    reason: { type: String, required: true }
}

const storageSuggestionSchema = new mongoose.Schema<StorageSuggestion>(
    {
        suggestedStorage: { type: String, required: true },
        reason: { type: String, required: true },
        expiryByStorage: {
            fridge: expiryEntrySchema,
            freezer: expiryEntrySchema,
            pantry: expiryEntrySchema
        }
    },
    { _id: false }
)

const pantryItemSchema = new mongoose.Schema<PantryItemDoc>(
    {
        userId: { type: String, required: true, index: true },
        name: { type: String, required: true },
        emoji: { type: String },
        storage: {
            type: String,
            enum: STORAGE_LOCATIONS,
            required: true
        },
        type: {
            type: String,
            enum: FOOD_TYPES,
            required: true
        },
        quantity: { type: Number, required: true },
        unit: {
            type: String,
            enum: UNITS,
            required: true
        },
        expiryDate: { type: Date },
        notes: { type: String },
        source: {
            type: String,
            enum: ITEM_SOURCES,
            default: ItemSource.Manual
        },
        storageSuggestion: {
            type: storageSuggestionSchema,
            default: null
        }
    },
    { timestamps: true }
)

export const PantryItemModel
    = (mongoose.models.PantryItem as mongoose.Model<PantryItemDoc>)
    ?? mongoose.model<PantryItemDoc>('PantryItem', pantryItemSchema)
