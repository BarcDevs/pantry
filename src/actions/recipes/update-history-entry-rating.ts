'use server'

import { z } from 'zod'

import type { Recipe, RecipeHistoryEntry }
    from '@/types/recipe'

import { requireUserId }
    from '@/lib/auth/require-user-id'
import { toPlainDoc } from '@/lib/mongo-doc'
import connectDB from '@/lib/mongodb'
import { objectIdSchema }
    from '@/lib/object-id-schema'
import { computeAverageRating }
    from '@/lib/recipes/compute-average-rating'

import { RecipeModel } from '@/models/recipe.model'

const ratingSchema = z.number().min(1).max(5).nullable()

export const updateHistoryEntryRating = async (
    id: string,
    entryId: string,
    rating: number | null
): Promise<Recipe> => {
    const userId = await requireUserId()
    const recipeId = objectIdSchema.parse(id)
    const parsedEntryId = z.string().min(1).parse(entryId)
    const parsedRating = ratingSchema.parse(rating)

    await connectDB()

    const recipe = await RecipeModel.findOne({
        _id: recipeId,
        userId
    }).lean<{ history: RecipeHistoryEntry[] } | null>()
    if (!recipe) throw new Error('Recipe not found')

    const entryExists = recipe.history.some(
        (entry) => entry.entryId === parsedEntryId
    )
    if (!entryExists) throw new Error('History entry not found')

    const history: RecipeHistoryEntry[] = recipe.history.map(
        (entry) => (
            entry.entryId === parsedEntryId
                ? { ...entry, rating: parsedRating }
                : entry
        )
    )

    const updated = await RecipeModel.findOneAndUpdate(
        { _id: recipeId, userId },
        { history, rating: computeAverageRating(history) },
        { returnDocument: 'after', runValidators: true }
    ).lean()
    if (!updated) throw new Error('Recipe not found')

    return toPlainDoc<Recipe>(updated)
}
