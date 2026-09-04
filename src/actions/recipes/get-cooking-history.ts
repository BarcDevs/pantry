'use server'

import { auth } from '@clerk/nextjs/server'

import type { Recipe } from '@/types/recipe'

import { toPlainDoc } from '@/lib/mongo-doc'
import connectDB from '@/lib/mongodb'

import { RecipeModel } from '@/models/recipe.model'

const latestCookedAt = (recipe: Recipe): number => (
    recipe.history.reduce(
        (latest, entry) =>
            Math.max(
                latest,
                new Date(entry.cookedAt).getTime()
            ),
        0
    )
)

export const getCookingHistory = async (
): Promise<Recipe[]> => {
    const { userId } = await auth()
    if (!userId) return []

    await connectDB()

    const rawRecipes = await RecipeModel
        .find({
            userId,
            'history.0': { $exists: true }
        })
        .lean()

    const recipes = rawRecipes.map(
        (doc) => toPlainDoc<Recipe>(doc)
    )
    return recipes.sort(
        (a, b) => latestCookedAt(b) - latestCookedAt(a)
    )
}
