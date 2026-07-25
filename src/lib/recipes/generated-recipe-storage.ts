import type { RecipeDoc } from '@/types/recipe'

const storageKey = 'pantry:generated-recipe'

export const saveGeneratedRecipe = (recipe: RecipeDoc): void => {
    sessionStorage.setItem(storageKey, JSON.stringify(recipe))
}

export const readGeneratedRecipe = (): RecipeDoc | null => {
    const raw = sessionStorage.getItem(storageKey)
    if (!raw) return null
    try {
        return JSON.parse(raw) as RecipeDoc
    } catch {
        return null
    }
}

export const clearGeneratedRecipe = (): void => {
    sessionStorage.removeItem(storageKey)
}
