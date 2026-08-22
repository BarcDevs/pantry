'use server'

import { isValidObjectId } from 'mongoose'
import { z } from 'zod'

import {
    FOOD_TYPES,
    STORAGE_LOCATIONS,
    UNITS
} from '@/types/enums'
import type {
    PantryItem,
    UpdatePantryItemInput
} from '@/types/pantry-item'

import { requireUserId } from '@/lib/auth/require-user-id'
import { toPlainDoc } from '@/lib/mongo-doc'
import connectDB from '@/lib/mongodb'
import { storageSuggestionSchema } from '@/lib/pantry/storage-suggestion-schema'

import { PantryItemModel } from '@/models/pantry-item.model'

const updatePantryItemSchema = z.object({
    name: z.string().trim().min(1).max(100).optional(),
    emoji: z.string().max(8).optional(),
    storage: z.enum(STORAGE_LOCATIONS).optional(),
    type: z.enum(FOOD_TYPES).nullable().optional(),
    quantity: z.number().positive().optional(),
    unit: z.enum(UNITS).optional(),
    expiryDate: z.date().optional(),
    notes: z.string().max(500).optional(),
    storageSuggestion: storageSuggestionSchema
})

export const updatePantryItem = async (
    id: string,
    input: UpdatePantryItemInput
): Promise<PantryItem> => {
    const userId = await requireUserId()
    if (!isValidObjectId(id)) throw new Error('Item not found')
    const parsedInput = updatePantryItemSchema.parse(input)

    await connectDB()

    const updated = await PantryItemModel.findOneAndUpdate(
        { _id: id, userId },
        parsedInput,
        { returnDocument: 'after', runValidators: true }
    ).lean()

    if (!updated) throw new Error('Item not found')
    return toPlainDoc<PantryItem>(updated)
}
