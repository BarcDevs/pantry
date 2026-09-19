import {
    type Dispatch,
    type SetStateAction,
    useCallback } from 'react'

import type { RecipeDoc } from '@/types/recipe'

import { refreshRecipePantryStatus } from '@/actions/recipes/refresh-recipe-pantry-status'

export const useRefreshPantryStatus = (
    setRecipe: Dispatch<SetStateAction<RecipeDoc | null>>
) => useCallback((recipe: RecipeDoc) => {
    refreshRecipePantryStatus(recipe)
        .then((ingredients) => setRecipe(
            (current) => (current ? { ...current, ingredients } : current)
        ))
        .catch((error: unknown) => console.error(error))
}, [setRecipe])
