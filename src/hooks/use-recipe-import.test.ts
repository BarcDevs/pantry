import {
    act,
    renderHook,
    waitFor
} from '@testing-library/react'

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
jest.mock('@/actions/recipes/refine-recipe', () => ({
    refineRecipe: jest.fn()
}))
jest.mock('@/actions/recipes/refresh-recipe-pantry-status', () => ({
    refreshRecipePantryStatus: jest.fn().mockResolvedValue([])
}))
jest.mock('@/actions/recipes/save-recipe', () => ({
    saveRecipe: jest.fn()
}))

import { useRouter } from 'next/navigation'

import { saveImportDraft } from '@/lib/recipes/import-draft-storage'
import { draftTtlMs } from '@/lib/recipes/recipe-draft-storage'

import { importRecipeFromText } from '@/actions/recipes/import-recipe-from-text'
import { importRecipeFromUrl } from '@/actions/recipes/import-recipe-from-url'
import { refineRecipe } from '@/actions/recipes/refine-recipe'
import { refreshRecipePantryStatus } from '@/actions/recipes/refresh-recipe-pantry-status'
import { saveRecipe } from '@/actions/recipes/save-recipe'

import { useRecipeImport } from './use-recipe-import'

const mockPush = jest.fn()
const mockUseRouter = useRouter as jest.Mock
const mockImportFromUrl = importRecipeFromUrl as jest.Mock
const mockImportFromText = importRecipeFromText as jest.Mock
const mockSaveRecipe = saveRecipe as jest.Mock
const mockRefineRecipe = refineRecipe as jest.Mock
const mockRefreshStatus = refreshRecipePantryStatus as jest.Mock
const draft = {
    title: 'טיוטה',
    ingredients: [],
    steps: []
} as never

describe('useRecipeImport', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        localStorage.clear()
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

    it('refines the imported recipe with the typed instruction', async () => {
        mockImportFromText.mockResolvedValue({
            recipe: { title: 'עוגה', ingredients: [], steps: [] },
            fallbackToManual: false
        })
        mockRefineRecipe.mockResolvedValue({
            title: 'עוגה (מעודכן)',
            ingredients: [],
            steps: []
        })

        const { result } = renderHook(() => useRecipeImport())
        await act(async () => result.current.importFromText('recipe text'))
        act(() => result.current.adjustments.setInstruction('בלי סוכר'))
        await act(async () => result.current.refine())

        expect(mockRefineRecipe).toHaveBeenCalledWith(expect.objectContaining({ instruction: 'בלי סוכר' }))
        expect(result.current.recipe?.title).toBe('עוגה (מעודכן)')
        expect(result.current.adjustments.instruction).toBe('')
    })

    it('restores the unsaved draft whenever the user returns to the page', () => {
        saveImportDraft(draft)

        const { result } = renderHook(() => useRecipeImport())

        expect(result.current.recipe?.title).toBe('טיוטה')
    })

    it('refreshes the ingredient pantry status of a restored draft', async () => {
        saveImportDraft(draft)
        mockRefreshStatus.mockResolvedValue([{ label: 'חלב', inPantry: true }])

        const { result } = renderHook(() => useRecipeImport())

        await waitFor(() => expect(result.current.recipe?.ingredients).toEqual([{
            label: 'חלב',
            inPantry: true
        }]))
    })

    it('does not restore a draft older than 30 minutes', () => {
        saveImportDraft(draft)
        jest.spyOn(Date, 'now').mockReturnValue(Date.now() + draftTtlMs)

        const { result } = renderHook(() => useRecipeImport())

        expect(result.current.recipe).toBeNull()
        jest.restoreAllMocks()
    })

    it('drops the draft when the user dismisses it', () => {
        saveImportDraft(draft)
        const { result } = renderHook(() => useRecipeImport())

        act(() => result.current.dismiss())

        expect(result.current.recipe).toBeNull()
        expect(renderHook(() => useRecipeImport()).result.current.recipe).toBeNull()
    })

    it('clears the draft once the recipe is saved', async () => {
        saveImportDraft(draft)
        mockSaveRecipe.mockResolvedValue({ _id: 'r1' })
        const { result } = renderHook(() => useRecipeImport())

        await act(async () => result.current.save())

        expect(renderHook(() => useRecipeImport()).result.current.recipe).toBeNull()
    })
})
