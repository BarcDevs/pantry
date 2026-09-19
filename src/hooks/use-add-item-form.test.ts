import {
    act,
    renderHook,
    waitFor
} from '@testing-library/react'

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(() => ({ push: jest.fn() }))
}))
jest.mock('sonner', () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn()
    }
}))
jest.mock('@/actions/pantry/add-pantry-items', () => ({
    addPantryItems: jest.fn()
}))
jest.mock('@/actions/pantry/suggest-storage', () => ({
    suggestStorage: jest.fn()
}))

import { StorageLocation } from '@/types/enums'

import { suggestStorage } from '@/actions/pantry/suggest-storage'

import { useAddItemForm } from './use-add-item-form'

const mockSuggestStorage = suggestStorage as jest.Mock

const suggestionFor = (suggestedStorage: StorageLocation) => ({
    recognized: true,
    suggestedStorage,
    reason: 'test',
    expiryByStorage: {}
})

describe('useAddItemForm storage', () => {
    beforeEach(() => jest.clearAllMocks())

    it('defaults the storage location to the pantry', () => {
        const { result } = renderHook(() => useAddItemForm())

        expect(result.current.form.getValues('storage')).toBe(StorageLocation.Pantry)
    })

    it('applies the AI suggested storage once it arrives', async () => {
        mockSuggestStorage.mockResolvedValue(suggestionFor(StorageLocation.Fridge))
        const { result } = renderHook(() => useAddItemForm())

        act(() => result.current.form.setValue('name', 'חלב'))

        await waitFor(() => expect(result.current.form.getValues('storage')).toBe(StorageLocation.Fridge))
    })
})
