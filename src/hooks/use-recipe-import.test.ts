import { act, renderHook } from '@testing-library/react'

jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
}))
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn()
    }
}))
jest.mock('@/actions/recipes/import-recipe-from-url', () => ({
    importRecipeFromUrl: jest.fn()
}))
jest.mock('@/actions/recipes/import-recipe-from-text', () => ({
    importRecipeFromText: jest.fn()
}))
jest.mock('@/actions/recipes/save-recipe', () => ({
    saveRecipe: jest.fn()
}))

import { useRouter } from 'next/navigation'

import { importRecipeFromText } from '@/actions/recipes/import-recipe-from-text'
import { importRecipeFromUrl } from '@/actions/recipes/import-recipe-from-url'
import { saveRecipe } from '@/actions/recipes/save-recipe'

import { useRecipeImport } from './use-recipe-import'

const mockPush = jest.fn()
const mockUseRouter = useRouter as jest.Mock
const mockImportFromUrl = importRecipeFromUrl as jest.Mock
const mockImportFromText = importRecipeFromText as jest.Mock
const mockSaveRecipe = saveRecipe as jest.Mock

describe('useRecipeImport', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockUseRouter.mockReturnValue({ push: mockPush })
    })

    it('sets an error and no recipe when the URL import falls back to manual', async () => {
        mockImportFromUrl.mockResolvedValue({
            recipe: null,
            fallbackToManual: true
        })

        const { result } = renderHook(() => useRecipeImport())

        await act(async () => result.current.importFromUrl('https://x.com'))

        expect(result.current.recipe).toBeNull()
        expect(result.current.error).not.toBeNull()
    })

    it('sets the recipe on a successful text import', async () => {
        mockImportFromText.mockResolvedValue({
            recipe: { title: 'עוגה', ingredients: [], steps: [] },
            fallbackToManual: false
        })

        const { result } = renderHook(() => useRecipeImport())

        await act(async () => result.current.importFromText('recipe text'))

        expect(result.current.recipe?.title).toBe('עוגה')
        expect(result.current.error).toBeNull()
    })

    it('saves the recipe and navigates to its detail page', async () => {
        mockImportFromText.mockResolvedValue({
            recipe: { title: 'עוגה', ingredients: [], steps: [] },
            fallbackToManual: false
        })
        mockSaveRecipe.mockResolvedValue({ _id: 'r1' })

        const { result } = renderHook(() => useRecipeImport())
        await act(async () => result.current.importFromText('recipe text'))
        await act(async () => result.current.save())

        expect(mockSaveRecipe).toHaveBeenCalled()
        expect(mockPush).toHaveBeenCalledWith('/recipes/r1')
    })
})
