import {
    act,
    renderHook
} from '@testing-library/react'

jest.mock('@/actions/pantry/suggest-storage', () => ({
    suggestStorage: jest.fn()
}))

import { suggestStorage } from '@/actions/pantry/suggest-storage'

import { useStorageSuggestion } from './use-storage-suggestion'

const mockSuggestStorage = suggestStorage as jest.Mock

const suggestion = (reason: string) => ({
    recognized: true,
    suggestedStorage: 'fridge',
    reason,
    expiryByStorage: {}
})

describe('useStorageSuggestion', () => {
    beforeEach(() => jest.clearAllMocks())

    it('starts from the initial suggestion', () => {
        const { result } = renderHook(() => useStorageSuggestion(suggestion('initial') as never))

        expect(result.current.suggestion?.reason).toBe('initial')
    })

    it('ignores names shorter than the minimum', async () => {
        const { result } = renderHook(() => useStorageSuggestion())

        await act(async () => result.current.request('ח'))

        expect(mockSuggestStorage).not.toHaveBeenCalled()
    })

    it('stores the result, reports it and passes the fresh flag through', async () => {
        mockSuggestStorage.mockResolvedValue(suggestion('new'))
        const onSuggested = jest.fn()
        const { result } = renderHook(() => useStorageSuggestion())

        await act(async () => result.current.request('חלב', {
            fresh: true,
            onSuggested
        }))

        expect(mockSuggestStorage).toHaveBeenCalledWith('חלב', { fresh: true })
        expect(result.current.suggestion?.reason).toBe('new')
        expect(onSuggested).toHaveBeenCalledWith(expect.objectContaining({ reason: 'new' }))
    })

    it('flags a failure and clears the suggestion', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => undefined)
        mockSuggestStorage.mockRejectedValue(new Error('boom'))
        const { result } = renderHook(() => useStorageSuggestion(suggestion('old') as never))

        await act(async () => result.current.request('חלב'))

        expect(result.current.suggestionFailed).toBe(true)
        expect(result.current.suggestion).toBeNull()
    })

    it('drops a result that arrives after the suggestion was cleared', async () => {
        let resolveRequest: (value: unknown) => void = () => undefined
        mockSuggestStorage.mockReturnValue(new Promise((resolve) => {
            resolveRequest = resolve
        }))
        const { result } = renderHook(() => useStorageSuggestion())

        act(() => result.current.request('חלב'))
        act(() => result.current.clear())
        await act(async () => resolveRequest(suggestion('stale')))

        expect(result.current.suggestion).toBeNull()
    })
})
