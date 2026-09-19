'use server'

import type { ExistingPantryItem } from '@/types/pantry-item'

import { requireUserId } from '@/lib/auth/require-user-id'
import connectDB from '@/lib/mongodb'
import { normalizeName } from '@/lib/normalize-name'

import { PantryItemModel } from '@/models/pantry-item.model'
import { pantryItemNameSchema } from '@/schemas/pantry-item-fields'

export const findExistingPantryItem = async (
    name: string
): Promise<ExistingPantryItem | null> => {
    const userId = await requireUserId()
    const normalizedName = normalizeName(pantryItemNameSchema.parse(name))

    await connectDB()
    const items = await PantryItemModel
        .find({ userId })
        .select('_id name quantity unit')
        .lean()

    const match = items.find((item) => normalizeName(item.name) === normalizedName)
    if (!match) return null

    return {
        _id: String(match._id),
        name: match.name,
        quantity: match.quantity,
        unit: match.unit
    }
}
