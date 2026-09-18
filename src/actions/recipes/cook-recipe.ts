'use server'

import { z } from 'zod'

import type { Recipe, RecipeHistoryEntry } from '@/types/recipe'

import { requireUserId } from '@/lib/auth/require-user-id'
import { toPlainDoc } from '@/lib/mongo-doc'
import connectDB from '@/lib/mongodb'
import { computeAverageRating }
    from '@/lib/recipes/compute-average-rating'

import { ActionError } from '@/constants/errors'

import { RecipeModel } from '@/models/recipe.model'
import { objectIdSchema } from '@/schemas/object-id-schema'

const ratingSchema = z.number().min(1).max(5).nullable()

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
    if (!recipe) throw new Error(ActionError.RecipeNotFound)

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
    if (!updated) throw new Error(ActionError.RecipeNotFound)

    return toPlainDoc<Recipe>(updated)
}
