'use server'

import { isValidObjectId } from 'mongoose'

import { requireUserId } from '@/lib/auth/require-user-id'
import connectDB from '@/lib/mongodb'

import { PantryItemModel } from '@/models/pantry-item.model'

export const deletePantryItem = async (id: string): Promise<void> => {
    const userId = await requireUserId()
    if (!isValidObjectId(id)) throw new Error('Item not found')

    await connectDB()

    const deleted = await PantryItemModel
        .findOneAndDelete({ _id: id, userId })
        .lean()

    if (!deleted) throw new Error('Item not found')
}
