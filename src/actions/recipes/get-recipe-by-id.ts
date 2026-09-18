'use server'

import type { Recipe } from '@/types/recipe'

import { auth } from '@/lib/auth'
import { toPlainDoc } from '@/lib/mongo-doc'
import connectDB from '@/lib/mongodb'
import type { MinimalPantryItem } from '@/lib/recipes/resolve-ingredient-pantry-status'
import { resolveIngredientPantryStatus } from '@/lib/recipes/resolve-ingredient-pantry-status'

import { PantryItemModel } from '@/models/pantry-item.model'
import { RecipeModel } from '@/models/recipe.model'
import { objectIdSchema } from '@/schemas/object-id-schema'

export const getRecipeById = async (
    id: string
): Promise<Recipe | null> => {
    const session = await auth()
    const userId = session?.user?.id
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
