import {
    act,
    renderHook,
    waitFor
} from '@testing-library/react'

import type { RecipeDoc } from '@/types/recipe'

import { findWebRecipe } from '@/lib/recipes/find-web-recipe'
import {
    clearGeneratedRecipe,
    saveGeneratedRecipe
} from '@/lib/recipes/generated-recipe-storage'
import { createSearchClient } from '@/lib/search/create-search-client'

import { generateRecipe } from '@/actions/recipes/generate-recipe'
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

const mockRetryContext = {
    request: {
        mealCount: 2,
        maxTime: 30,
        mealType: 'dinner',
        scope: 'pantry-first',
        allowAiGeneration: true,
        matchStrictness: 'flexible'
    },
    shownUrls: ['https://a.co.il/first']
}

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
    readGeneratedRetryContext: jest.fn(() => mockRetryContext),
    saveGeneratedRecipe: jest.fn(),
    clearGeneratedRecipe: jest.fn()
}))
const mockRefreshPantryStatus = jest.fn()

jest.mock('@/hooks/use-refresh-pantry-status', () => ({
    useRefreshPantryStatus: () => mockRefreshPantryStatus
}))
jest.mock('@/actions/recipes/generate-recipe', () => ({
    generateRecipe: jest.fn()
}))
jest.mock('@/lib/recipes/find-web-recipe', () => ({
    findWebRecipe: jest.fn()
}))
jest.mock('@/lib/search/create-search-client', () => ({
    createSearchClient: jest.fn()
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
const mockGenerateRecipe = generateRecipe as jest.Mock
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

describe('useRecipeResult retry', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockSaveRecipe.mockResolvedValue({ _id: 'saved1' })
    })

    it('offers retry for an unsaved generated draft and hides it once saved', async () => {
        const { result } = renderHook(() => useRecipeResult())
        await waitFor(() => expect(result.current.retry.isAvailable).toBe(true))

        await act(async () => {
            await result.current.actions.save()
        })

        expect(result.current.retry.isAvailable).toBe(false)
    })

    it('replaces the recipe, clears the saved id and persists the new draft on retry', async () => {
        mockGenerateRecipe.mockResolvedValue({
            status: 'found',
            recipe: {
                ...mockDraft,
                title: 'second',
                sourceUrl: 'https://b.co.il/second'
            }
        })
        const { result } = renderHook(() => useRecipeResult())
        await waitFor(() => expect(result.current.retry.isAvailable).toBe(true))

        await act(async () => result.current.retry.run())

        expect(result.current.recipe?.title).toBe('second')
        expect(mockGenerateRecipe.mock.calls[0][0].excludeUrls).toEqual(['https://a.co.il/first'])
        expect(saveGeneratedRecipe).toHaveBeenCalledWith(
            expect.objectContaining({ title: 'second' }),
            expect.objectContaining({
                shownUrls: [
                    'https://a.co.il/first',
                    'https://b.co.il/second'
                ]
            })
        )
    })

    it('keeps the current recipe visible when a web-only retry finds nothing new', async () => {
        mockGenerateRecipe.mockResolvedValue({
            status: 'no-match',
            reason: 'not-found'
        })
        const { result } = renderHook(() => useRecipeResult())
        await waitFor(() => expect(result.current.retry.isAvailable).toBe(true))

        await act(async () => result.current.retry.run())

        expect(result.current.recipe?.title).toBe('shakshuka')
        expect(result.current.retry.noMatch.isOpen).toBe(true)
    })
})

describe('useRecipeResult tweak never searches', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockRefineRecipe.mockResolvedValue({
            ...mockDraft,
            title: 'refined shakshuka'
        })
    })

    const expectNoSearch = () => {
        expect(mockGenerateRecipe).not.toHaveBeenCalled()
        expect(findWebRecipe).not.toHaveBeenCalled()
        expect(createSearchClient).not.toHaveBeenCalled()
    }

    it('calls only refineRecipe when the user tweaks a draft', async () => {
        const { result } = renderHook(() => useRecipeResult())
        await waitFor(() => expect(result.current.recipe).not.toBeNull())

        act(() => result.current.adjustments.setField('instruction', 'less salt'))
        await act(async () => result.current.actions.refine())

        await waitFor(() => expect(result.current.recipe?.title).toBe('refined shakshuka'))
        expect(mockRefineRecipe).toHaveBeenCalledTimes(1)
        expectNoSearch()
    })

    it('after a retry-generated draft, a tweak still only calls refineRecipe', async () => {
        mockGenerateRecipe.mockResolvedValue({
            status: 'found',
            recipe: {
                ...mockDraft,
                title: 'retried',
                sourceUrl: 'https://b.co.il/second'
            }
        })
        const { result } = renderHook(() => useRecipeResult())
        await waitFor(() => expect(result.current.retry.isAvailable).toBe(true))
        await act(async () => result.current.retry.run())
        await waitFor(() => expect(result.current.recipe?.title).toBe('retried'))
        expect(mockGenerateRecipe).toHaveBeenCalledTimes(1)

        act(() => result.current.adjustments.setField('instruction', 'less salt'))
        await act(async () => result.current.actions.refine())

        await waitFor(() => expect(result.current.recipe?.title).toBe('refined shakshuka'))
        expect(mockRefineRecipe).toHaveBeenCalledTimes(1)
        expect(mockRefineRecipe.mock.calls[0][0].recipe.title).toBe('retried')
        expect(mockGenerateRecipe).toHaveBeenCalledTimes(1)
        expect(findWebRecipe).not.toHaveBeenCalled()
        expect(createSearchClient).not.toHaveBeenCalled()
    })
})
