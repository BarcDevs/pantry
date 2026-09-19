import { createRecipeDraftStorage } from '@/lib/recipes/recipe-draft-storage'

const storage = createRecipeDraftStorage('pantry:import-draft')

export const saveImportDraft = storage.save
export const readImportDraft = storage.read
export const clearImportDraft = storage.clear
