'use server'

import type { RecipeImportResult } from '@/types/recipe'

import { requireUserId } from '@/lib/auth/require-user-id'
import connectDB from '@/lib/mongodb'
import { fetchPageText } from '@/lib/network/fetch-page-text'
import { parseUrlInput } from '@/lib/network/parse-url-input'
import { buildRecipeFromPage } from '@/lib/recipes/build-recipe-from-page'
import type { MinimalPantryItem } from '@/lib/recipes/resolve-ingredient-pantry-status'

import { PantryItemModel } from '@/models/pantry-item.model'

export const importRecipeFromUrl = async (
    url: string
): Promise<RecipeImportResult> => {
    const userId = await requireUserId()
    const parsedUrl = parseUrlInput(url)
    const fetched = parsedUrl === null ? null : await fetchPageText(parsedUrl)
    if (parsedUrl === null || fetched?.status !== 'ok') {
        return {
            recipe: null,
            fallbackToManual: true,
            isBlocked: fetched?.status === 'blocked'
        }
    }

    await connectDB()
    const pantryItems = await PantryItemModel
        .find({ userId })
        .lean<MinimalPantryItem[]>()

    const built = await buildRecipeFromPage({
        userId,
        pageUrl: parsedUrl,
        page: fetched,
        pantryItems
    })

    if (built.status === 'failed') {
        return {
            recipe: null,
            fallbackToManual: true,
            isBlocked: false
        }
    }

    return {
        recipe: built.recipe,
        fallbackToManual: false,
        isBlocked: false
    }
}
