'use server'

import type { Recipe, RecipeDoc } from '@/types/recipe'

import { refineRecipe } from '@/actions/recipes/refine-recipe'
import { saveRecipe } from '@/actions/recipes/save-recipe'

export const branchRecipe = async (
    recipe: RecipeDoc,
    instruction: string
): Promise<Recipe> => {
    const refined = await refineRecipe({ recipe, instruction })

    return saveRecipe({
        ...refined,
        rating: null,
        history: [],
        isFavorite: false
    })
}
