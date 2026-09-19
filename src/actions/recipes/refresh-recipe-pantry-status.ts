'use server'

import type {
    RecipeDoc,
    RecipeIngredient
} from '@/types/recipe'

import { requireUserId } from '@/lib/auth/require-user-id'
import connectDB from '@/lib/mongodb'
import type { MinimalPantryItem } from '@/lib/recipes/resolve-ingredient-pantry-status'
import { resolveIngredientPantryStatus } from '@/lib/recipes/resolve-ingredient-pantry-status'

import { ActionError } from '@/constants/errors'

import { PantryItemModel } from '@/models/pantry-item.model'
import { recipeDocSchema } from '@/schemas/recipe-doc-schema'

export const refreshRecipePantryStatus = async (
    input: RecipeDoc
): Promise<RecipeIngredient[]> => {
    const userId = await requireUserId()
    const recipe = recipeDocSchema.parse(input)
    if (recipe.userId !== userId) {
        throw new Error(ActionError.Forbidden)
    }

    await connectDB()
    const pantryItems = await PantryItemModel
        .find({ userId })
        .lean<MinimalPantryItem[]>()

    return resolveIngredientPantryStatus(recipe.ingredients, pantryItems)
}
