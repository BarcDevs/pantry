'use server'

import { auth } from '@clerk/nextjs/server'

import type { Recipe } from '@/types/recipe'

import { toPlainDoc } from '@/lib/mongo-doc'
import connectDB from '@/lib/mongodb'
import { objectIdSchema } from '@/lib/object-id-schema'
import type { MinimalPantryItem } from '@/lib/recipes/resolve-ingredient-pantry-status'
import { resolveIngredientPantryStatus } from '@/lib/recipes/resolve-ingredient-pantry-status'

import { PantryItemModel } from '@/models/pantry-item.model'
import { RecipeModel } from '@/models/recipe.model'

export const getRecipeById = async (
    id: string
): Promise<Recipe | null> => {
    const { userId } = await auth()
    if (!userId) return null

    const parsedId = objectIdSchema.safeParse(id)
    if (!parsedId.success) return null

    await connectDB()

    const recipe = await RecipeModel.findOne({
        _id: parsedId.data,
        userId
    }).lean()

    if (!recipe) return null

    const pantryItems = await PantryItemModel
        .find({ userId })
        .lean<MinimalPantryItem[]>()

    const plainRecipe = toPlainDoc<Recipe>(recipe)
    return {
        ...plainRecipe,
        ingredients: resolveIngredientPantryStatus(
            plainRecipe.ingredients,
            pantryItems
        )
    }
}
