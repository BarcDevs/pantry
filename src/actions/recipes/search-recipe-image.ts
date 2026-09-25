'use server'

import { z } from 'zod'

import { searchRecipeImage as searchRecipeImageViaAi } from '@/lib/ai/search-recipe-image'
import { requireUserId } from '@/lib/auth/require-user-id'

const searchRecipeImageSchema = z.object({
    title: z.string().trim().min(1),
    ingredients: z.array(z.string().trim().min(1)).min(1)
})

export const searchRecipeImage = async (
    input: { title: string; ingredients: string[] }
): Promise<{ imageUrl: string | null }> => {
    await requireUserId()
    const { title, ingredients } = searchRecipeImageSchema.parse(input)

    const imageUrl = await searchRecipeImageViaAi(
        title,
        ingredients,
        () => 'https://example.co.il/mock-recipe-image.jpg'
    )

    return { imageUrl }
}
