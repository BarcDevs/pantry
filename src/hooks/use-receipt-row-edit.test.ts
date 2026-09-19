import {
    act,
    renderHook,
    waitFor
} from '@testing-library/react'

jest.mock('@/actions/pantry/suggest-storage', () => ({
    suggestStorage: jest.fn()
}))

import { suggestStorage } from '@/actions/pantry/suggest-storage'

import { useReceiptRowEdit } from './use-receipt-row-edit'

const mockSuggestStorage = suggestStorage as jest.Mock

const row = {
    name: 'חלב',
    storage: 'fridge',
    type: 'meat',
    expiryDate: '',
    storageSuggestion: null
} as never

const suggestion = {
    recognized: true,
    suggestedStorage: 'fridge',
    suggestedType: 'dairy',
    reason: 'test',
    expiryByStorage: {}
}

describe('useReceiptRowEdit suggested type', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockSuggestStorage.mockResolvedValue(suggestion)
    })

    it('keeps the set type on a plain request', async () => {
        const { result } = renderHook(() => useReceiptRowEdit(row))

        act(() => result.current.suggestion.request())

        await waitFor(() => expect(result.current.suggestion.value).not.toBeNull())
        expect(result.current.values.type).toBe('meat')
    })

    it('is stale after a name change without clearing or requesting', async () => {
        const { result } = renderHook(() => useReceiptRowEdit(row))
        act(() => result.current.suggestion.request())
        await waitFor(() => expect(result.current.suggestion.value).not.toBeNull())
        expect(result.current.suggestion.stale).toBe(false)

        act(() => result.current.setField('name', 'גבינה'))

        expect(result.current.suggestion.stale).toBe(true)
        expect(result.current.suggestion.value).not.toBeNull()
        expect(mockSuggestStorage).toHaveBeenCalledTimes(1)
    })

    it('treats an initial suggestion as generated for the row name', () => {
        const withSuggestion = { ...(row as object), storageSuggestion: suggestion } as never
        const { result } = renderHook(() => useReceiptRowEdit(withSuggestion))
        expect(result.current.suggestion.stale).toBe(false)

        act(() => result.current.setField('name', 'גבינה'))

        expect(result.current.suggestion.stale).toBe(true)
    })

    it('is not stale again after a refresh for the new name', async () => {
        const { result } = renderHook(() => useReceiptRowEdit(row))
        act(() => result.current.suggestion.request())
        await waitFor(() => expect(result.current.suggestion.value).not.toBeNull())
        act(() => result.current.setField('name', 'גבינה'))

        act(() => result.current.suggestion.refresh())

        await waitFor(() => expect(result.current.suggestion.stale).toBe(false))
    })

    it('replaces the set type on refresh', async () => {
        const { result } = renderHook(() => useReceiptRowEdit(row))

        act(() => result.current.suggestion.refresh())

        await waitFor(() => expect(result.current.values.type).toBe('dairy'))
    })

    it('keeps a type picked while the request was in flight', async () => {
        let resolve: (value: unknown) => void = () => undefined
        mockSuggestStorage.mockReturnValue(new Promise((done) => { resolve = done }))
        const emptyRow = { ...(row as object), type: null } as never
        const { result } = renderHook(() => useReceiptRowEdit(emptyRow))

        act(() => result.current.suggestion.request())
        act(() => result.current.setField('type', 'meat' as never))
        await act(async () => resolve(suggestion))

        expect(result.current.values.type).toBe('meat')
    })
})
