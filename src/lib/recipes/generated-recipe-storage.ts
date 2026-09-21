import type { GeneratedRetryContext } from '@/types/recipe'

import { createRecipeDraftStorage } from '@/lib/recipes/recipe-draft-storage'

const storage = createRecipeDraftStorage<GeneratedRetryContext>('pantry:generated-recipe')

export const saveGeneratedRecipe = storage.save
export const readGeneratedRecipe = storage.read
export const readGeneratedRetryContext = storage.readContext
export const clearGeneratedRecipe = storage.clear
