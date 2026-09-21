import {
    act,
    renderHook
} from '@testing-library/react'

import type { RecipeDoc } from '@/types/recipe'

import {
    readGeneratedRetryContext,
    saveGeneratedRecipe
} from '@/lib/recipes/generated-recipe-storage'

import { routes } from '@/constants/routes'

import { generateRecipe } from '@/actions/recipes/generate-recipe'

import { useRecipeRetry } from './use-recipe-retry'

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
    readGeneratedRetryContext: jest.fn(),
    saveGeneratedRecipe: jest.fn()
}))
jest.mock('@/actions/recipes/generate-recipe', () => ({
    generateRecipe: jest.fn()
}))

const mockGenerateRecipe = generateRecipe as jest.Mock
const mockReadContext = readGeneratedRetryContext as jest.Mock

const request = {
    mealCount: 2,
    maxTime: 30,
    mealType: 'dinner' as const,
    scope: 'pantry-first' as const,
    allowAiGeneration: false,
    matchStrictness: 'flexible' as const,
    customInstructions: 'לזניה'
}
const firstUrl = 'https://a.co.il/first'
const notFound = {
    status: 'no-match',
    reason: 'not-found'
}

const setup = () => {
    const onRecipeReplaced = jest.fn()
    const hook = renderHook(() => useRecipeRetry(onRecipeReplaced))
    return {
        ...hook,
        onRecipeReplaced
    }
}

describe('useRecipeRetry', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockReadContext.mockReturnValue({
            request,
            shownUrls: [firstUrl]
        })
    })

    it('has no context (button hidden) when the draft has no stored request', () => {
        mockReadContext.mockReturnValue(null)

        const { result } = setup()

        expect(result.current.hasContext).toBe(false)
    })

    it('re-runs the same request excluding the shown urls and swaps in the new recipe', async () => {
        const next = {
            title: 'new',
            sourceUrl: 'https://b.co.il/second'
        } as RecipeDoc
        mockGenerateRecipe.mockResolvedValue({
            status: 'found',
            recipe: next
        })
        const { result, onRecipeReplaced } = setup()

        await act(async () => result.current.run())

        expect(mockGenerateRecipe).toHaveBeenCalledWith({
            ...request,
            excludeUrls: [firstUrl]
        })
        expect(onRecipeReplaced).toHaveBeenCalledWith(next)
        expect(saveGeneratedRecipe).toHaveBeenCalledWith(next, {
            request,
            shownUrls: [firstUrl, 'https://b.co.il/second']
        })
    })

    it('keeps growing the excluded list across consecutive retries', async () => {
        mockGenerateRecipe
            .mockResolvedValueOnce({
                status: 'found',
                recipe: { sourceUrl: 'https://b.co.il/second' }
            })
            .mockResolvedValueOnce({
                status: 'found',
                recipe: { sourceUrl: 'https://c.co.il/third' }
            })
        const { result } = setup()

        await act(async () => result.current.run())
        await act(async () => result.current.run())

        expect(mockGenerateRecipe.mock.calls[1][0].excludeUrls).toEqual([
            firstUrl,
            'https://b.co.il/second'
        ])
    })

    it('keeps the list unchanged when the new recipe is AI generated (no source url)', async () => {
        mockGenerateRecipe.mockResolvedValue({
            status: 'found',
            recipe: { title: 'ai' }
        })
        const { result } = setup()

        await act(async () => result.current.run())

        expect(saveGeneratedRecipe).toHaveBeenCalledWith(
            { title: 'ai' },
            {
                request,
                shownUrls: [firstUrl]
            }
        )
    })

    it('opens the no-match modal with the dish and keeps the current recipe when nothing new is found', async () => {
        mockGenerateRecipe.mockResolvedValue(notFound)
        const { result, onRecipeReplaced } = setup()

        await act(async () => result.current.run())

        expect(result.current.noMatch.isOpen).toBe(true)
        expect(result.current.noMatch.dish).toBe('לזניה')
        expect(onRecipeReplaced).not.toHaveBeenCalled()
        expect(saveGeneratedRecipe).not.toHaveBeenCalled()
    })

    it('enables AI and retries from the modal, storing the new request', async () => {
        mockGenerateRecipe
            .mockResolvedValueOnce(notFound)
            .mockResolvedValueOnce({
                status: 'found',
                recipe: { title: 'ai' }
            })
        const { result } = setup()
        await act(async () => result.current.run())

        await act(async () => result.current.noMatch.enableAiAndRetry())

        expect(mockGenerateRecipe.mock.calls[1][0]).toEqual({
            ...request,
            allowAiGeneration: true,
            excludeUrls: [firstUrl]
        })
        expect(result.current.noMatch.isOpen).toBe(false)
        expect(saveGeneratedRecipe).toHaveBeenCalledWith(
            { title: 'ai' },
            {
                request: {
                    ...request,
                    allowAiGeneration: true
                },
                shownUrls: [firstUrl]
            }
        )
    })

    it('goes back to the generate form on edit request and closes the modal on close', async () => {
        mockGenerateRecipe.mockResolvedValue(notFound)
        const { result } = setup()
        await act(async () => result.current.run())

        act(() => result.current.noMatch.close())
        expect(result.current.noMatch.isOpen).toBe(false)

        act(() => result.current.noMatch.editRequest())
        expect(mockRouter.push).toHaveBeenCalledWith(routes.generate)
    })
})
