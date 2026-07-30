'use server'

import { z } from 'zod'

import type { DeductPantryItemEdit } from '@/types/pantry-item'

import { requireUserId } from '@/lib/auth/require-user-id'
import connectDB from '@/lib/mongodb'

import { PantryItemModel } from '@/models/pantry-item.model'

const deductEditSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/),
    newQuantity: z.number().min(0),
    remove: z.boolean().optional()
})

const deductEditsSchema = z.array(deductEditSchema)

export const deductPantryItems = async (edits: DeductPantryItemEdit[]): Promise<void> => {
    const userId = await requireUserId()
    const parsedEdits = deductEditsSchema.parse(edits)

    await connectDB()

    await Promise.all(parsedEdits.map((edit) => edit.remove
        ? PantryItemModel.findOneAndDelete({ _id: edit.id, userId })
        : PantryItemModel.findOneAndUpdate(
            { _id: edit.id, userId },
            { quantity: edit.newQuantity },
            { runValidators: true }
        )))
}
