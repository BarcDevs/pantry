'use server'

import type { Recipe, RecipeDoc } from '@/types/recipe'

import { requireUserId } from '@/lib/auth/require-user-id'
import { toPlainDoc } from '@/lib/mongo-doc'
import connectDB from '@/lib/mongodb'

import { RecipeModel } from '@/models/recipe.model'
import { recipeDocSchema } from '@/schemas/recipe-doc-schema'

export const saveRecipe = async (
    recipe: RecipeDoc
): Promise<Recipe> => {
    const userId = await requireUserId()
    const parsedRecipe = recipeDocSchema.parse({ ...recipe, userId })

    await connectDB()

    const created = await RecipeModel.create(parsedRecipe)
    return toPlainDoc<Recipe>(created.toObject())
}
