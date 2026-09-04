'use server'

import { z } from 'zod'

import type { Recipe, RecipeHistoryEntry } from '@/types/recipe'

import { requireUserId } from '@/lib/auth/require-user-id'
import { toPlainDoc } from '@/lib/mongo-doc'
import connectDB from '@/lib/mongodb'
import { objectIdSchema } from '@/lib/object-id-schema'

import { RecipeModel } from '@/models/recipe.model'

const ratingSchema = z.number().min(1).max(5).nullable()

const computeAverageRating = (
    history: RecipeHistoryEntry[]
): number | null => {
    const ratedEntries = history.filter(
        (entry): entry is RecipeHistoryEntry & { rating: number } => (
            entry.rating !== null
        )
    )
    if (ratedEntries.length === 0) return null

    const sum = ratedEntries.reduce(
        (total, entry) => total + entry.rating,
        0
    )
    return Math.round((sum / ratedEntries.length) * 10) / 10
}

export const cookRecipe = async (
    id: string,
    rating: number | null
): Promise<Recipe> => {
    const userId = await requireUserId()
    const recipeId = objectIdSchema.parse(id)
    const parsedRating = ratingSchema.parse(rating)

    await connectDB()

    const recipe = await RecipeModel.findOne({
        _id: recipeId,
        userId
    }).lean<{ history: RecipeHistoryEntry[] } | null>()
    if (!recipe) throw new Error('Recipe not found')

    const history: RecipeHistoryEntry[] = [
        ...recipe.history,
        {
            entryId: crypto.randomUUID(),
            cookedAt: new Date(),
            rating: parsedRating
        }
    ]

    const updated = await RecipeModel.findOneAndUpdate(
        { _id: recipeId, userId },
        { history, rating: computeAverageRating(history) },
        { returnDocument: 'after', runValidators: true }
    ).lean()
    if (!updated) throw new Error('Recipe not found')

    return toPlainDoc<Recipe>(updated)
}
