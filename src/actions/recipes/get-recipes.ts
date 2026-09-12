'use server'

import type { RecipeSource } from '@/types/enums'
import type { Recipe } from '@/types/recipe'

import { auth } from '@/lib/auth'
import { toPlainDoc } from '@/lib/mongo-doc'
import connectDB from '@/lib/mongodb'
import type { MinimalPantryItem } from '@/lib/recipes/resolve-ingredient-pantry-status'
import { resolveIngredientPantryStatus } from '@/lib/recipes/resolve-ingredient-pantry-status'

import { PantryItemModel } from '@/models/pantry-item.model'
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
    const session = await auth()
    const userId = session?.user?.id
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

    const pantryItems = await PantryItemModel
        .find({ userId })
        .lean<MinimalPantryItem[]>()

    return rawRecipes.map((doc) => {
        const recipe = toPlainDoc<Recipe>(doc)
        return {
            ...recipe,
            ingredients: resolveIngredientPantryStatus(
                recipe.ingredients,
                pantryItems
            )
        }
    })
}
