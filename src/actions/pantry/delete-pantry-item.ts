'use server'

import { requireUserId } from '@/lib/auth/require-user-id'
import connectDB from '@/lib/mongodb'

import { ActionError } from '@/constants/errors'

import { PantryItemModel } from '@/models/pantry-item.model'
import { objectIdSchema } from '@/schemas/object-id-schema'

export const deletePantryItem = async (id: string): Promise<void> => {
    const userId = await requireUserId()
    if (!objectIdSchema.safeParse(id).success) throw new Error(ActionError.ItemNotFound)

    await connectDB()

    const deleted = await PantryItemModel
        .findOneAndDelete({ _id: id, userId })
        .lean()

    if (!deleted) throw new Error(ActionError.ItemNotFound)
}
