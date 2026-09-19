import {
    act,
    renderHook,
    waitFor
} from '@testing-library/react'

import type { RecipeDoc } from '@/types/recipe'

import {
    clearGeneratedRecipe,
    saveGeneratedRecipe
} from '@/lib/recipes/generated-recipe-storage'

import { saveRecipe } from '@/actions/recipes/save-recipe'
import { updateRecipe } from '@/actions/recipes/update-recipe'

import { useRecipeResult } from './use-recipe-result'

const mockDraft = { title: 'shakshuka', isFavorite: false } as RecipeDoc

const mockRouter = {
    push: jest.fn(),
    replace: jest.fn()
}

jest.mock('next/navigation', () => ({
    useRouter: () => mockRouter
}))
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn()
    }
}))
jest.mock('@/lib/recipes/generated-recipe-storage', () => ({
    readGeneratedRecipe: jest.fn(() => mockDraft),
    saveGeneratedRecipe: jest.fn(),
    clearGeneratedRecipe: jest.fn()
}))
const mockRefreshPantryStatus = jest.fn()

jest.mock('@/hooks/use-refresh-pantry-status', () => ({
    useRefreshPantryStatus: () => mockRefreshPantryStatus
}))
jest.mock('@/actions/recipes/refine-recipe', () => ({
    refineRecipe: jest.fn()
}))
jest.mock('@/actions/recipes/save-recipe', () => ({
    saveRecipe: jest.fn()
}))
jest.mock('@/actions/recipes/update-recipe', () => ({
    updateRecipe: jest.fn()
}))

const mockSaveRecipe = saveRecipe as jest.Mock
const mockUpdateRecipe = updateRecipe as jest.Mock

describe('useRecipeResult favorite and image edits', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockSaveRecipe.mockResolvedValue({ _id: 'saved1' })
        mockUpdateRecipe.mockResolvedValue({})
    })

    it('re-persists the draft while the recipe is unsaved', async () => {
        const { result } = renderHook(() => useRecipeResult())
        await waitFor(() => expect(result.current.recipe).not.toBeNull())

        act(() => result.current.actions.toggleFavorite())

        expect(saveGeneratedRecipe).toHaveBeenCalledWith(expect.objectContaining({ isFavorite: true }))
        expect(mockUpdateRecipe).not.toHaveBeenCalled()
    })

    it('updates the saved recipe instead of recreating a draft after save', async () => {
        const { result } = renderHook(() => useRecipeResult())
        await waitFor(() => expect(result.current.recipe).not.toBeNull())
        await act(async () => {
            await result.current.actions.save()
        })
        expect(clearGeneratedRecipe).toHaveBeenCalled()
        ;(saveGeneratedRecipe as jest.Mock).mockClear()

        act(() => result.current.actions.toggleFavorite())

        expect(mockUpdateRecipe).toHaveBeenCalledWith('saved1', { isFavorite: true })
        expect(saveGeneratedRecipe).not.toHaveBeenCalled()
        expect(result.current.status.savedRecipeId).toBe('saved1')
        expect(result.current.recipe?.isFavorite).toBe(true)
    })

    it('sends null to unset the image of a saved recipe when the URL is cleared', async () => {
        const { result } = renderHook(() => useRecipeResult())
        await waitFor(() => expect(result.current.recipe).not.toBeNull())
        await act(async () => {
            await result.current.actions.save()
        })

        act(() => result.current.actions.setManualImageUrl(''))

        expect(mockUpdateRecipe).toHaveBeenCalledWith('saved1', { imageUrl: null })
        expect(result.current.recipe?.imageUrl).toBeUndefined()
    })
})
