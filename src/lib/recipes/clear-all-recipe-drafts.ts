import { clearGeneratedRecipe } from '@/lib/recipes/generated-recipe-storage'
import { clearImportDraft } from '@/lib/recipes/import-draft-storage'

export const clearAllRecipeDrafts = (): void => {
    clearGeneratedRecipe()
    clearImportDraft()
}
