'use server'

import { z } from 'zod'

import {
    FOOD_TYPES,
    STORAGE_LOCATIONS,
    UNITS
} from '@/types/enums'
import type {
    AddPantryItemInput,
    AddPantryItemOutcome,
    PantryItem
} from '@/types/pantry-item'

import { requireUserId }
    from '@/lib/auth/require-user-id'
import { toPlainDoc } from '@/lib/mongo-doc'
import connectDB from '@/lib/mongodb'
import { normalizeName }
    from '@/lib/normalize-name'
import { storageSuggestionSchema }
    from '@/lib/pantry/storage-suggestion-schema'

import { PantryItemModel }
    from '@/models/pantry-item.model'

const addPantryItemSchema = z.object({
    name: z.string().trim().min(1).max(100),
    emoji: z.string().max(8).optional(),
    storage: z.enum(STORAGE_LOCATIONS),
    type: z.enum(FOOD_TYPES).nullable(),
    quantity: z.number().positive(),
    unit: z.enum(UNITS),
    expiryDate: z.date().optional(),
    notes: z.string().max(500).optional(),
    storageSuggestion: storageSuggestionSchema,
    mergeWithId: z.string().optional(),
    forceSeparate: z.boolean().optional()
})

export const addPantryItems = async (
    entries: AddPantryItemInput[]
): Promise<AddPantryItemOutcome[]> => {
    const userId = await requireUserId()
    const parsedEntries = entries.map(
        (entry) => addPantryItemSchema.parse(entry)
    )

    await connectDB()

    const rawItems = await PantryItemModel
        .find({ userId })
        .select('_id name')
        .lean()
    const knownItems: Array<{ _id: string, name: string }> = rawItems.map(
        (doc) => ({ _id: String(doc._id), name: doc.name })
    )

    const outcomes: AddPantryItemOutcome[] = []

    for (const entry of parsedEntries) {
        if (entry.mergeWithId) {
            const updated = await (
                PantryItemModel.findOneAndUpdate(
                    {
                        _id: entry.mergeWithId,
                        userId
                    },
                    {
                        $inc: {
                            quantity: entry.quantity
                        }
                    },
                    {
                        returnDocument: 'after',
                        runValidators: true
                    }
                ).lean()
            )
            if (!updated) throw new Error('Item not found')

            const item = toPlainDoc<PantryItem>(updated)
            outcomes.push({ status: 'created', item })
            const knownIndex = knownItems.findIndex(
                (known) => known._id === item._id
            )
            if (knownIndex !== -1) {
                knownItems[knownIndex] = { _id: item._id, name: item.name }
            }
            continue
        }

        const duplicateMatch = entry.forceSeparate
            ? undefined
            : knownItems.find((known) => (
                normalizeName(known.name)
                    === normalizeName(entry.name)
            ))

        if (duplicateMatch) {
            const existing = await PantryItemModel
                .findOne({ _id: duplicateMatch._id, userId })
                .lean()
            if (!existing) throw new Error('Item not found')

            outcomes.push({
                status: 'duplicate',
                existing: toPlainDoc<PantryItem>(existing),
                incoming: entry
            })
            continue
        }

        const created = await PantryItemModel.create(
            {
                userId,
                name: entry.name,
                emoji: entry.emoji,
                storage: entry.storage,
                type: entry.type,
                quantity: entry.quantity,
                unit: entry.unit,
                expiryDate: entry.expiryDate,
                notes: entry.notes,
                storageSuggestion: (
                    entry.storageSuggestion ?? null
                )
            }
        )

        const item = toPlainDoc<PantryItem>(created.toObject())
        outcomes.push({ status: 'created', item })
        knownItems.push({ _id: item._id, name: item.name })
    }

    return outcomes
}
