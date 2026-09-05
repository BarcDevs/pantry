'use server'

import { requireUserId } from '@/lib/auth/require-user-id'
import connectDB from '@/lib/mongodb'
import { objectIdSchema } from '@/lib/object-id-schema'

import { RecipeModel } from '@/models/recipe.model'

export const deleteRecipe = async (id: string): Promise<void> => {
    const userId = await requireUserId()
    const recipeId = objectIdSchema.parse(id)

    await connectDB()

    const deleted = await RecipeModel
        .findOneAndDelete({ _id: recipeId, userId })
        .lean()

    if (!deleted) throw new Error('Recipe not found')
}
