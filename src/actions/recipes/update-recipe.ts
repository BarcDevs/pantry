'use server'

import { z } from 'zod'

import type { Recipe, UpdateRecipeInput } from '@/types/recipe'

import { requireUserId } from '@/lib/auth/require-user-id'
import { toPlainDoc } from '@/lib/mongo-doc'
import connectDB from '@/lib/mongodb'
import {
    ingredientSchema,
    stepSchema
} from '@/lib/recipes/recipe-doc-schema'

import { RecipeModel } from '@/models/recipe.model'

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/)

const updateRecipeSchema = z.object({
    title: z.string().trim().min(1).max(200).optional(),
    isFavorite: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    ingredients: z.array(ingredientSchema).optional(),
    steps: z.array(stepSchema).optional(),
    imageUrl: z.string().url().optional()
})

export const updateRecipe = async (
    id: string,
    input: UpdateRecipeInput
): Promise<Recipe> => {
    const userId = await requireUserId()
    const recipeId = objectIdSchema.parse(id)
    const changes = updateRecipeSchema.parse(input)

    await connectDB()

    const updated = await RecipeModel.findOneAndUpdate(
        { _id: recipeId, userId },
        changes,
        { returnDocument: 'after', runValidators: true }
    ).lean()

    if (!updated) throw new Error('Recipe not found')

    return toPlainDoc<Recipe>(updated)
}
