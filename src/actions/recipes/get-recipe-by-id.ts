'use server'

import { z } from 'zod'

import { auth } from '@clerk/nextjs/server'

import type { Recipe } from '@/types/recipe'

import { toPlainDoc } from '@/lib/mongo-doc'
import connectDB from '@/lib/mongodb'

import { RecipeModel } from '@/models/recipe.model'

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/)

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

    return recipe ? toPlainDoc<Recipe>(recipe) : null
}
