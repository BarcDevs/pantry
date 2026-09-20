import {
    act,
    renderHook,
    waitFor
} from '@testing-library/react'

jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn()
    }
}))
jest.mock('@/actions/pantry/suggest-storage', () => ({
    suggestStorage: jest.fn()
}))
jest.mock('@/actions/pantry/update-pantry-item', () => ({
    updatePantryItem: jest.fn()
}))
jest.mock('@/actions/pantry/delete-pantry-item', () => ({
    deletePantryItem: jest.fn()
}))

import { suggestStorage } from '@/actions/pantry/suggest-storage'

import { useEditItemForm } from './use-edit-item-form'

const mockSuggestStorage = suggestStorage as jest.Mock

const item = {
    _id: 'i1',
    name: 'חלב',
    storage: 'fridge',
    type: 'meat',
    quantity: 1,
    unit: 'units',
    notes: ''
} as never

const suggestion = {
    recognized: true,
    suggestedStorage: 'fridge',
    suggestedType: 'dairy',
    reason: 'test',
    expiryByStorage: {}
}

const setup = () => renderHook(() => useEditItemForm({
    item,
    onSaved: jest.fn(),
    onDeleted: jest.fn()
}))

describe('useEditItemForm suggested type', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockSuggestStorage.mockResolvedValue(suggestion)
    })

    it('keeps the set type on a plain request', async () => {
        const { result } = setup()

        act(() => result.current.suggestion.request())

        await waitFor(() =>
            expect(result.current.suggestion.value).not.toBeNull())
        expect(result.current.form.getValues('type')).toBe('meat')
    })

    it('is stale after a name change without clearing or requesting', async () => {
        const { result } = setup()
        act(() => result.current.suggestion.request())
        await waitFor(() =>
            expect(result.current.suggestion.value).not.toBeNull())
        expect(result.current.suggestion.stale).toBe(false)

        act(() => result.current.form.setValue('name', 'גבינה'))

        expect(result.current.suggestion.stale).toBe(true)
        expect(result.current.suggestion.value).not.toBeNull()
        expect(mockSuggestStorage).toHaveBeenCalledTimes(1)
    })

    it('is not stale again after a refresh for the new name', async () => {
        const { result } = setup()
        act(() => result.current.suggestion.request())
        await waitFor(() =>
            expect(result.current.suggestion.value).not.toBeNull())
        act(() => result.current.form.setValue('name', 'גבינה'))

        act(() => result.current.suggestion.refresh())

        await waitFor(() =>
            expect(result.current.suggestion.stale).toBe(false))
    })

    it('replaces the set type on refresh', async () => {
        const { result } = setup()

        act(() => result.current.suggestion.refresh())

        await waitFor(() =>
            expect(result.current.form.getValues('type')).toBe('dairy'))
    })
})
