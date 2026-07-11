'use server'

import { auth } from '@clerk/nextjs/server'

import type { PantryItem } from '@/types/pantry-item'

import { toPlainDoc } from '@/lib/mongo-doc'
import connectDB from '@/lib/mongodb'

import { PantryItemModel } from '@/models/pantry-item.model'

type GetPantryItemsOptions = {
    expiringWithinDays?: number
}

export const getPantryItems = async (
    options: GetPantryItemsOptions = {}
): Promise<PantryItem[]> => {
    const { userId } = await auth()
    if (!userId) return []

    await connectDB()

    const query: Record<string, unknown> = { userId }
    if (options.expiringWithinDays !== undefined) {
        const threshold = new Date()
        threshold.setDate(threshold.getDate()
            + options.expiringWithinDays)
        query.expiryDate = { $lte: threshold }
    }

    const rawItems = await PantryItemModel
        .find(query)
        .sort({ expiryDate: 1 })
        .lean()

    const items: PantryItem[] = rawItems.map(
        (doc) => toPlainDoc<PantryItem>(doc)
    )

    // Mongo's ascending sort puts missing/null expiryDate first, not last —
    // re-partition in JS to get the "nulls last" ordering the PRD requires.
    const withExpiry = items.filter((item) => item.expiryDate)
    const withoutExpiry = items.filter((item) => !item.expiryDate)
    return [...withExpiry, ...withoutExpiry]
}
