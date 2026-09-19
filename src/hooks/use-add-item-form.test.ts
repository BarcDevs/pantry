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
jest.mock('@/actions/pantry/find-existing-pantry-item', () => ({
    findExistingPantryItem: jest.fn()
}))
jest.mock('@/actions/pantry/suggest-storage', () => ({
    suggestStorage: jest.fn()
}))

import {
    PantryUnit,
    StorageLocation
} from '@/types/enums'

import { addPantryItems } from '@/actions/pantry/add-pantry-items'
import { findExistingPantryItem } from '@/actions/pantry/find-existing-pantry-item'
import { suggestStorage } from '@/actions/pantry/suggest-storage'

import { useAddItemForm } from './use-add-item-form'

const mockSuggestStorage = suggestStorage as jest.Mock
const mockFindExisting = findExistingPantryItem as jest.Mock
const mockAddItems = addPantryItems as jest.Mock

const suggestionFor = (suggestedStorage: StorageLocation) => ({
    recognized: true,
    suggestedStorage,
    reason: 'test',
    expiryByStorage: {}
})

describe('useAddItemForm storage', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockFindExisting.mockResolvedValue(null)
    })

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

describe('useAddItemForm type refresh', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockFindExisting.mockResolvedValue(null)
    })

    const typedSuggestion = (suggestedType: string) => ({
        ...suggestionFor(StorageLocation.Fridge),
        suggestedType
    })

    it('fills the type from the automatic suggestion only while it is empty', async () => {
        mockSuggestStorage.mockResolvedValue(typedSuggestion('dairy'))
        const { result } = renderHook(() => useAddItemForm())
        act(() => result.current.form.setValue('type', 'meat' as never))

        act(() => result.current.form.setValue('name', 'חלב'))

        await waitFor(() => expect(mockSuggestStorage).toHaveBeenCalled())
        expect(result.current.form.getValues('type')).toBe('meat')
    })

    it('replaces the type when the user refreshes the suggestion', async () => {
        mockSuggestStorage.mockResolvedValue(typedSuggestion('dairy'))
        const { result } = renderHook(() => useAddItemForm())
        act(() => result.current.form.setValue('name', 'חלב'))
        await waitFor(() => expect(result.current.form.getValues('type')).toBe('dairy'))

        mockSuggestStorage.mockResolvedValue(typedSuggestion('beverages'))
        act(() => result.current.retrySuggestion())

        await waitFor(() => expect(result.current.form.getValues('type')).toBe('beverages'))
    })
})

describe('useAddItemForm merge prompt', () => {
    const existing = {
        _id: 'item1',
        name: 'חלב',
        quantity: 2,
        unit: PantryUnit.Units
    }

    const setup = async () => {
        mockSuggestStorage.mockResolvedValue(suggestionFor(StorageLocation.Fridge))
        mockAddItems.mockResolvedValue([{ status: 'created', item: existing }])
        const rendered = renderHook(() => useAddItemForm())
        act(() => {
            rendered.result.current.form.setValue('name', 'חלב')
            rendered.result.current.form.setValue('type', 'dairy' as never)
            rendered.result.current.form.setValue('quantity', 1)
        })
        await waitFor(() => expect(rendered.result.current.mergePrompt).not.toBeNull())
        return rendered
    }

    beforeEach(() => {
        jest.clearAllMocks()
        mockFindExisting.mockResolvedValue(existing)
    })

    it('offers to merge when an item with the same name and unit exists', async () => {
        const { result } = await setup()

        expect(result.current.mergePrompt).toEqual({
            existing,
            isMerging: false,
            addedQuantity: 1,
            total: 3
        })
    })

    it('does not offer to merge when the unit differs', async () => {
        const { result } = await setup()

        act(() => result.current.form.setValue('unit', PantryUnit.Kg))

        await waitFor(() => expect(result.current.mergePrompt).toBeNull())
    })

    it('shows the merged total and submits with mergeWithId once merging', async () => {
        const { result } = await setup()

        act(() => result.current.startMerge())
        act(() => result.current.form.setValue('quantity', 3))
        await act(async () => result.current.handleSubmit())

        expect(result.current.mergePrompt).toEqual(expect.objectContaining({
            isMerging: true,
            total: 5
        }))
        expect(mockAddItems).toHaveBeenCalledWith([
            expect.objectContaining({ mergeWithId: 'item1' })
        ])
    })

    it('submits as a normal add when the user did not merge, so the duplicate dialog can still appear', async () => {
        const { result } = await setup()
        mockAddItems.mockResolvedValue([{
            status: 'duplicate',
            existing,
            incoming: {}
        }])

        await act(async () => result.current.handleSubmit())

        expect(mockAddItems).toHaveBeenCalledWith([
            expect.not.objectContaining({ mergeWithId: expect.anything() })
        ])
        await waitFor(() => expect(result.current.duplicate).not.toBeNull())
    })

    it('stops merging when the user cancels', async () => {
        const { result } = await setup()

        act(() => result.current.startMerge())
        act(() => result.current.cancelMerge())

        expect(result.current.mergePrompt?.isMerging).toBe(false)
    })
})
