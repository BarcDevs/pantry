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

        act(() => result.current.requestSuggestion())

        await waitFor(() => expect(result.current.suggestion).not.toBeNull())
        expect(result.current.type).toBe('meat')
    })

    it('replaces the set type on refresh', async () => {
        const { result } = renderHook(() => useReceiptRowEdit(row))

        act(() => result.current.refreshSuggestion())

        await waitFor(() => expect(result.current.type).toBe('dairy'))
    })

    it('keeps a type picked while the request was in flight', async () => {
        let resolve: (value: unknown) => void = () => undefined
        mockSuggestStorage.mockReturnValue(new Promise((done) => { resolve = done }))
        const emptyRow = { ...(row as object), type: null } as never
        const { result } = renderHook(() => useReceiptRowEdit(emptyRow))

        act(() => result.current.requestSuggestion())
        act(() => result.current.setType('meat' as never))
        await act(async () => resolve(suggestion))

        expect(result.current.type).toBe('meat')
    })
})
