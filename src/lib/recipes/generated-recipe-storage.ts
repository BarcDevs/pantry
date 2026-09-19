import { createRecipeDraftStorage } from '@/lib/recipes/recipe-draft-storage'

const storage = createRecipeDraftStorage('pantry:generated-recipe')

export const saveGeneratedRecipe = storage.save
export const readGeneratedRecipe = storage.read
export const clearGeneratedRecipe = storage.clear
