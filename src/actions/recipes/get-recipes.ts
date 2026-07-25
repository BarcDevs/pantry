'use server'

import { auth } from '@clerk/nextjs/server'

import type { RecipeSource } from '@/types/enums'
import type { Recipe } from '@/types/recipe'

import { toPlainDoc } from '@/lib/mongo-doc'
import connectDB from '@/lib/mongodb'

import { RecipeModel } from '@/models/recipe.model'

type GetRecipesOptions = {
    search?: string
    isFavorite?: boolean
    minRating?: number
    source?: RecipeSource
}

const escapeRegex = (value: string): string => (
    value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
)

export const getRecipes = async (
    options: GetRecipesOptions = {}
): Promise<Recipe[]> => {
    const { userId } = await auth()
    if (!userId) return []

    await connectDB()

    const query: Record<string, unknown> = { userId }
    if (options.search) {
        query.title = {
            $regex: escapeRegex(options.search.slice(0, 100)),
            $options: 'i'
        }
    }
    if (options.isFavorite !== undefined) {
        query.isFavorite = options.isFavorite
    }
    if (options.minRating !== undefined) {
        query.rating = { $gte: options.minRating }
    }
    if (options.source) {
        query.source = options.source
    }

    const rawRecipes = await RecipeModel
        .find(query)
        .sort({ createdAt: -1 })
        .lean()

    return rawRecipes.map((doc) => toPlainDoc<Recipe>(doc))
}
