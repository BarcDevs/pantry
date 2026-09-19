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

import { refineRecipe } from '@/actions/recipes/refine-recipe'
import { saveRecipe } from '@/actions/recipes/save-recipe'
import { updateRecipe } from '@/actions/recipes/update-recipe'

import { useRecipeResult } from './use-recipe-result'

const originalImageUrl = 'https://example.com/original.jpg'
const mockDraft = {
    title: 'shakshuka',
    isFavorite: false,
    imageUrl: originalImageUrl
} as RecipeDoc

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

const mockRefineRecipe = refineRecipe as jest.Mock
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

describe('useRecipeResult image edits across save and refine', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockSaveRecipe.mockResolvedValue({ _id: 'saved1' })
        mockUpdateRecipe.mockResolvedValue({})
        mockRefineRecipe.mockResolvedValue({
            ...mockDraft,
            title: 'refined shakshuka'
        })
    })

    it('removes the image from the persisted draft while unsaved', async () => {
        const { result } = renderHook(() => useRecipeResult())
        await waitFor(() => expect(result.current.recipe).not.toBeNull())

        act(() => result.current.actions.setManualImageUrl(''))

        const persisted = (saveGeneratedRecipe as jest.Mock).mock.calls[0][0]
        expect(persisted.imageUrl).toBeUndefined()
        expect(persisted.title).toBe('shakshuka')
        expect(mockUpdateRecipe).not.toHaveBeenCalled()
    })

    it('edits the new draft, not the previously saved recipe, after save then refine', async () => {
        const { result } = renderHook(() => useRecipeResult())
        await waitFor(() => expect(result.current.recipe).not.toBeNull())
        await act(async () => {
            await result.current.actions.save()
        })
        expect(result.current.status.savedRecipeId).toBe('saved1')

        act(() => result.current.adjustments.setField('instruction', 'less salt'))
        await act(async () => result.current.actions.refine())
        await waitFor(() => expect(result.current.recipe?.title).toBe('refined shakshuka'))
        expect(result.current.status.savedRecipeId).toBeNull()
        expect(result.current.recipe?.imageUrl).toBe(originalImageUrl)
        ;(saveGeneratedRecipe as jest.Mock).mockClear()

        act(() => result.current.actions.setManualImageUrl(''))

        expect(mockUpdateRecipe).not.toHaveBeenCalled()
        const persisted = (saveGeneratedRecipe as jest.Mock).mock.calls[0][0]
        expect(persisted.title).toBe('refined shakshuka')
        expect(persisted.imageUrl).toBeUndefined()
        expect(result.current.recipe?.imageUrl).toBeUndefined()

        act(() => result.current.actions.setManualImageUrl('https://example.com/new.jpg'))

        expect(mockUpdateRecipe).not.toHaveBeenCalled()
        expect(result.current.recipe?.imageUrl).toBe('https://example.com/new.jpg')
    })
})
