'use server'

import type {
    PantryItem,
    UpdatePantryItemInput
} from '@/types/pantry-item'

import { requireUserId } from '@/lib/auth/require-user-id'
import { toPlainDoc } from '@/lib/mongo-doc'
import connectDB from '@/lib/mongodb'

import { ActionError } from '@/constants/errors'

import { PantryItemModel } from '@/models/pantry-item.model'
import { objectIdSchema } from '@/schemas/object-id-schema'
import { pantryItemBaseSchema } from '@/schemas/pantry-item-fields'

const updatePantryItemSchema = pantryItemBaseSchema.partial()

export const updatePantryItem = async (
    id: string,
    input: UpdatePantryItemInput
): Promise<PantryItem> => {
    const userId = await requireUserId()
    if (!objectIdSchema.safeParse(id).success) throw new Error(ActionError.ItemNotFound)
    const parsedInput = updatePantryItemSchema.parse(input)

    await connectDB()

    const updated = await PantryItemModel.findOneAndUpdate(
        { _id: id, userId },
        parsedInput,
        { returnDocument: 'after', runValidators: true }
    ).lean()

    if (!updated) throw new Error(ActionError.ItemNotFound)
    return toPlainDoc<PantryItem>(updated)
}
