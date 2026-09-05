import {
    act,
    renderHook,
    waitFor
} from '@testing-library/react'

import { getCookingHistory } from '@/actions/recipes/get-cooking-history'
import { updateRecipe } from '@/actions/recipes/update-recipe'

import { useCookingHistory } from './use-cooking-history'

jest.mock('@/actions/recipes/get-cooking-history', () => ({ getCookingHistory: jest.fn() }))
jest.mock('@/actions/recipes/update-history-entry-rating', () => ({ updateHistoryEntryRating: jest.fn() }))
jest.mock('@/actions/recipes/update-recipe', () => ({ updateRecipe: jest.fn() }))
jest.mock('sonner', () => ({ toast: { error: jest.fn() } }))

const recipe = {
    _id: 'r1',
    title: 'עוגה',
    emoji: '🍰',
    isFavorite: false,
    history: [{
        entryId: 'e1',
        rating: null,
        cookedAt: '2026-01-10'
    }]
}

describe('useCookingHistory toggleFavorite', () => {
    beforeEach(() => {
        jest.mocked(getCookingHistory).mockResolvedValue([recipe] as never)
    })

    it('optimistically flips isFavorite and persists it', async () => {
        jest.mocked(updateRecipe).mockResolvedValue({} as never)
        const { result } = renderHook(() => useCookingHistory())
        await waitFor(() => expect(result.current.rows).not.toBeNull())

        act(() => result.current.toggleFavorite(result.current.rows![0]))

        expect(result.current.rows![0].isFavorite).toBe(true)
        await waitFor(() => expect(updateRecipe).toHaveBeenCalledWith('r1', { isFavorite: true }))
    })

    it('rolls back isFavorite when the update fails', async () => {
        jest.mocked(updateRecipe).mockRejectedValue(new Error('fail'))
        const { result } = renderHook(() => useCookingHistory())
        await waitFor(() => expect(result.current.rows).not.toBeNull())

        act(() => result.current.toggleFavorite(result.current.rows![0]))
        expect(result.current.rows![0].isFavorite).toBe(true)

        await waitFor(() => expect(result.current.rows![0].isFavorite).toBe(false))
    })
})
