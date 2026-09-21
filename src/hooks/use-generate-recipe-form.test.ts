import {
    act,
    renderHook,
    waitFor
} from '@testing-library/react'

import { saveGeneratedRecipe } from '@/lib/recipes/generated-recipe-storage'

import { routes } from '@/constants/routes'

import { getPantryItems } from '@/actions/pantry/get-pantry-items'
import { generateRecipe } from '@/actions/recipes/generate-recipe'

import { useGenerateRecipeForm } from './use-generate-recipe-form'

const mockRouter = { push: jest.fn() }

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
    saveGeneratedRecipe: jest.fn()
}))
jest.mock('@/actions/pantry/get-pantry-items', () => ({
    getPantryItems: jest.fn()
}))
jest.mock('@/actions/recipes/generate-recipe', () => ({
    generateRecipe: jest.fn()
}))

const mockGenerateRecipe = generateRecipe as jest.Mock
const mockGetPantryItems = getPantryItems as jest.Mock
const notFound = {
    status: 'no-match',
    reason: 'not-found'
}

const setup = async () => {
    const hook = renderHook(() => useGenerateRecipeForm())
    await waitFor(() => expect(hook.result.current.pantry.isLoading).toBe(false))
    return hook
}

describe('useGenerateRecipeForm no-match modal', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockGetPantryItems.mockResolvedValue([])
    })

    it('opens the modal with the requested dish when the web-only search finds nothing', async () => {
        mockGenerateRecipe.mockResolvedValue(notFound)
        const { result } = await setup()
        act(() => {
            result.current.form.setValue('allowAiGeneration', false)
            result.current.form.setValue('customInstructions', ' לזניה ')
        })

        await act(() => result.current.submission.submit())

        expect(result.current.noMatch.isOpen).toBe(true)
        expect(result.current.noMatch.dish).toBe('לזניה')
    })

    it('opens the modal with an empty dish when none was typed', async () => {
        mockGenerateRecipe.mockResolvedValue(notFound)
        const { result } = await setup()
        act(() => result.current.form.setValue('allowAiGeneration', false))

        await act(() => result.current.submission.submit())

        expect(result.current.noMatch.isOpen).toBe(true)
        expect(result.current.noMatch.dish).toBe('')
    })

    it('does not open the modal for a search-unavailable error', async () => {
        mockGenerateRecipe.mockResolvedValue({
            status: 'no-match',
            reason: 'search-unavailable'
        })
        const { result } = await setup()
        act(() => result.current.form.setValue('allowAiGeneration', false))

        await act(() => result.current.submission.submit())

        expect(result.current.noMatch.isOpen).toBe(false)
    })

    it('closes the modal without resubmitting on dismiss', async () => {
        mockGenerateRecipe.mockResolvedValue(notFound)
        const { result } = await setup()
        act(() => result.current.form.setValue('allowAiGeneration', false))
        await act(() => result.current.submission.submit())

        act(() => result.current.noMatch.close())

        expect(result.current.noMatch.isOpen).toBe(false)
        expect(mockGenerateRecipe).toHaveBeenCalledTimes(1)
    })

    it('turns the AI toggle on and resubmits the same request', async () => {
        mockGenerateRecipe
            .mockResolvedValueOnce(notFound)
            .mockResolvedValueOnce({
                status: 'found',
                recipe: { title: 'r' }
            })
        const { result } = await setup()
        act(() => {
            result.current.form.setValue('allowAiGeneration', false)
            result.current.form.setValue('customInstructions', 'לזניה')
        })
        await act(() => result.current.submission.submit())

        await act(async () => result.current.noMatch.enableAiAndRetry())

        await waitFor(() => expect(mockGenerateRecipe).toHaveBeenCalledTimes(2))
        expect(mockGenerateRecipe.mock.calls[1][0]).toEqual(expect.objectContaining({
            allowAiGeneration: true,
            customInstructions: 'לזניה'
        }))
        expect(result.current.form.getValues('allowAiGeneration')).toBe(true)
        expect(result.current.noMatch.isOpen).toBe(false)
        await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith(routes.generateResult))
        expect(saveGeneratedRecipe).toHaveBeenCalledWith(
            { title: 'r' },
            {
                request: expect.objectContaining({
                    allowAiGeneration: true,
                    customInstructions: 'לזניה'
                }),
                shownUrls: []
            }
        )
    })
})
