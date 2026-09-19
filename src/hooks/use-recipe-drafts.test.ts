import {
    act,
    renderHook
} from '@testing-library/react'

import type { RecipeDoc } from '@/types/recipe'

import { saveGeneratedRecipe } from '@/lib/recipes/generated-recipe-storage'
import { saveImportDraft } from '@/lib/recipes/import-draft-storage'

import { useRecipeDrafts } from './use-recipe-drafts'

const recipe = (title: string) => ({
    title,
    ingredients: [],
    steps: []
}) as unknown as RecipeDoc

describe('useRecipeDrafts', () => {
    beforeEach(() => localStorage.clear())

    it('returns no drafts when nothing is stored', () => {
        const { result } = renderHook(() => useRecipeDrafts())

        expect(result.current.drafts).toEqual([])
    })

    it('lists the generated and imported drafts with their destinations', () => {
        saveGeneratedRecipe(recipe('שקשוקה'))
        saveImportDraft(recipe('עוגה'))

        const { result } = renderHook(() => useRecipeDrafts())

        expect(result.current.drafts.map((draft) => [draft.kind, draft.href])).toEqual([
            ['generated', '/generate/result'],
            ['imported', '/recipes/import']
        ])
    })

    it('dismisses only the chosen draft and clears its storage', () => {
        saveGeneratedRecipe(recipe('שקשוקה'))
        saveImportDraft(recipe('עוגה'))
        const { result } = renderHook(() => useRecipeDrafts())

        act(() => result.current.dismiss('generated'))

        expect(result.current.drafts.map((draft) => draft.kind)).toEqual(['imported'])
        expect(localStorage.getItem('pantry:generated-recipe')).toBeNull()
        expect(localStorage.getItem('pantry:import-draft')).not.toBeNull()
    })
})
