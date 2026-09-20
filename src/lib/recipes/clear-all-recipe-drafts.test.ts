import type { RecipeDoc } from '@/types/recipe'

import { clearAllRecipeDrafts } from './clear-all-recipe-drafts'
import {
    readGeneratedRecipe,
    saveGeneratedRecipe
} from './generated-recipe-storage'
import {
    readImportDraft,
    saveImportDraft
} from './import-draft-storage'

const recipe = { title: 'shakshuka' } as RecipeDoc

describe('clearAllRecipeDrafts', () => {
    beforeEach(() => localStorage.clear())

    it('removes both the generated and the imported draft', () => {
        saveGeneratedRecipe(recipe)
        saveImportDraft(recipe)

        clearAllRecipeDrafts()

        expect(readGeneratedRecipe()).toBeNull()
        expect(readImportDraft()).toBeNull()
    })

    it('does nothing when there are no drafts', () => {
        expect(() => clearAllRecipeDrafts()).not.toThrow()
    })
})
