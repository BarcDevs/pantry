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
        act(() => result.current.suggestion.refresh())

        await waitFor(() => expect(result.current.form.getValues('type')).toBe('beverages'))
    })

    it('keeps a type the user picked when retrying a failed suggestion', async () => {
        mockSuggestStorage.mockRejectedValueOnce(new Error('ai down'))
        const { result } = renderHook(() => useAddItemForm())
        act(() => result.current.form.setValue('name', 'חלב'))
        await waitFor(() => expect(result.current.suggestion.failed).toBe(true))
        act(() => result.current.form.setValue('type', 'meat' as never))

        mockSuggestStorage.mockResolvedValue(typedSuggestion('dairy'))
        act(() => result.current.suggestion.retry())

        await waitFor(() => expect(result.current.suggestion.failed).toBe(false))
        expect(result.current.form.getValues('type')).toBe('meat')
    })

    it('does not carry a refresh over to a later name change', async () => {
        mockSuggestStorage.mockResolvedValue(typedSuggestion('dairy'))
        const { result } = renderHook(() => useAddItemForm())
        act(() => result.current.form.setValue('name', 'ח'))
        act(() => result.current.suggestion.refresh())
        act(() => result.current.form.setValue('type', 'meat' as never))

        act(() => result.current.form.setValue('name', 'חלב'))

        await waitFor(() => expect(mockSuggestStorage).toHaveBeenCalled())
        expect(result.current.form.getValues('type')).toBe('meat')
    })
})

describe('useAddItemForm name correction', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockFindExisting.mockResolvedValue(null)
    })

    const typeName = (
        result: { current: ReturnType<typeof useAddItemForm> },
        name: string
    ) => act(() => result.current.form.setValue('name', name))

    const namedSuggestion = (suggestedName: string) => ({
        ...suggestionFor(StorageLocation.Fridge),
        suggestedName
    })

    it('auto-corrects the name and exposes what it was corrected from', async () => {
        mockSuggestStorage.mockResolvedValue(namedSuggestion('עגבניה'))
        const { result } = renderHook(() => useAddItemForm())

        typeName(result, 'עגבניות')

        await waitFor(() => expect(result.current.form.getValues('name')).toBe('עגבניה'))
        await waitFor(() => expect(result.current.nameCorrection.correctedFrom).toBe('עגבניות'))
    })

    it('does not correct when the suggestion matches the typed name', async () => {
        mockSuggestStorage.mockResolvedValue(namedSuggestion('עגבניה'))
        const { result } = renderHook(() => useAddItemForm())

        typeName(result, 'עגבניה')

        await waitFor(() => expect(mockSuggestStorage).toHaveBeenCalled())
        expect(result.current.nameCorrection.correctedFrom).toBeNull()
    })

    it('reverts the name and clears the correction', async () => {
        mockSuggestStorage.mockResolvedValue(namedSuggestion('עגבניה'))
        const { result } = renderHook(() => useAddItemForm())
        typeName(result, 'עגבניות')
        await waitFor(() => expect(result.current.nameCorrection.correctedFrom).toBe('עגבניות'))

        act(() => result.current.nameCorrection.revert())

        expect(result.current.form.getValues('name')).toBe('עגבניות')
        expect(result.current.nameCorrection.correctedFrom).toBeNull()
    })

    it('clears the correction once the user edits the name again', async () => {
        mockSuggestStorage.mockResolvedValue(namedSuggestion('עגבניה'))
        const { result } = renderHook(() => useAddItemForm())
        typeName(result, 'עגבניות')
        await waitFor(() => expect(result.current.nameCorrection.correctedFrom).toBe('עגבניות'))

        typeName(result, 'עגבניה חדשה')

        await waitFor(() => expect(result.current.nameCorrection.correctedFrom).toBeNull())
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
        await waitFor(() => expect(rendered.result.current.merge.prompt).not.toBeNull())
        return rendered
    }

    beforeEach(() => {
        jest.clearAllMocks()
        mockFindExisting.mockResolvedValue(existing)
    })

    it('offers to merge when an item with the same name and unit exists', async () => {
        const { result } = await setup()

        expect(result.current.merge.prompt).toEqual({
            existing,
            isMerging: false,
            addedQuantity: 1,
            total: 3
        })
    })

    it('does not offer to merge when the unit differs', async () => {
        const { result } = await setup()

        act(() => result.current.form.setValue('unit', PantryUnit.Kg))

        await waitFor(() => expect(result.current.merge.prompt).toBeNull())
    })

    it('shows the merged total and submits with mergeWithId once merging', async () => {
        const { result } = await setup()

        act(() => result.current.merge.start())
        act(() => result.current.form.setValue('quantity', 3))
        await act(async () => result.current.submission.submit())

        expect(result.current.merge.prompt).toEqual(expect.objectContaining({
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

        await act(async () => result.current.submission.submit())

        expect(mockAddItems).toHaveBeenCalledWith([
            expect.not.objectContaining({ mergeWithId: expect.anything() })
        ])
        await waitFor(() => expect(result.current.submission.duplicate.value).not.toBeNull())
    })

    it('stops merging when the user cancels', async () => {
        const { result } = await setup()

        act(() => result.current.merge.start())
        act(() => result.current.merge.cancel())

        expect(result.current.merge.prompt?.isMerging).toBe(false)
    })
})

describe('useAddItemForm suggestion persistence', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockFindExisting.mockResolvedValue(null)
    })

    const typeName = (
        result: { current: ReturnType<typeof useAddItemForm> },
        name: string
    ) => act(() => result.current.form.setValue('name', name))

    it('keeps the suggestion when the name only gains a trailing space', async () => {
        mockSuggestStorage.mockResolvedValue(suggestionFor(StorageLocation.Fridge))
        const { result } = renderHook(() => useAddItemForm())
        typeName(result, 'חלב')
        await waitFor(() => expect(result.current.suggestion.value).not.toBeNull())

        typeName(result, 'חלב ')

        await act(async () => new Promise((resolve) => setTimeout(resolve, 700)))
        expect(result.current.suggestion.value).not.toBeNull()
        expect(mockSuggestStorage).toHaveBeenCalledTimes(1)
    })

    it('does not request again for a new name while a suggestion exists', async () => {
        mockSuggestStorage.mockResolvedValue(suggestionFor(StorageLocation.Fridge))
        const { result } = renderHook(() => useAddItemForm())
        typeName(result, 'חלב')
        await waitFor(() => expect(result.current.suggestion.value).not.toBeNull())

        typeName(result, 'גבינה')

        await act(async () => new Promise((resolve) => setTimeout(resolve, 700)))
        expect(result.current.suggestion.value).not.toBeNull()
        expect(mockSuggestStorage).toHaveBeenCalledTimes(1)
    })

    it('replaces the suggestion only when the user refreshes', async () => {
        mockSuggestStorage.mockResolvedValue(suggestionFor(StorageLocation.Fridge))
        const { result } = renderHook(() => useAddItemForm())
        typeName(result, 'חלב')
        await waitFor(() => expect(result.current.suggestion.value?.suggestedStorage).toBe(StorageLocation.Fridge))

        mockSuggestStorage.mockResolvedValue(suggestionFor(StorageLocation.Freezer))
        act(() => result.current.suggestion.refresh())

        await waitFor(() => expect(result.current.suggestion.value?.suggestedStorage).toBe(StorageLocation.Freezer))
        expect(mockSuggestStorage).toHaveBeenLastCalledWith('חלב', { fresh: true })
    })

    it('does not drop an in-flight result when the user keeps typing', async () => {
        let resolveRequest: (value: unknown) => void = () => undefined
        mockSuggestStorage.mockReturnValue(new Promise((resolve) => {
            resolveRequest = resolve
        }))
        const { result } = renderHook(() => useAddItemForm())
        typeName(result, 'חלב')
        await waitFor(() => expect(mockSuggestStorage).toHaveBeenCalledTimes(1))

        typeName(result, 'חלב ')
        await act(async () => resolveRequest(suggestionFor(StorageLocation.Fridge)))

        expect(result.current.suggestion.value).not.toBeNull()
    })
})

describe('useAddItemForm stale suggestion', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockFindExisting.mockResolvedValue(null)
        mockSuggestStorage.mockResolvedValue(suggestionFor(StorageLocation.Fridge))
    })

    const typeName = (
        result: { current: ReturnType<typeof useAddItemForm> },
        name: string
    ) => act(() => result.current.form.setValue('name', name))

    it('turns stale after a name change without clearing or requesting', async () => {
        const { result } = renderHook(() => useAddItemForm())
        typeName(result, 'חלב')
        await waitFor(() => expect(result.current.suggestion.value).not.toBeNull())
        expect(result.current.suggestion.stale).toBe(false)

        typeName(result, 'גבינה')

        await act(async () => new Promise((resolve) => setTimeout(resolve, 700)))
        expect(result.current.suggestion.stale).toBe(true)
        expect(result.current.suggestion.value).not.toBeNull()
        expect(mockSuggestStorage).toHaveBeenCalledTimes(1)
    })

    it('is not stale for a trailing space and clears after refresh', async () => {
        const { result } = renderHook(() => useAddItemForm())
        typeName(result, 'חלב')
        await waitFor(() => expect(result.current.suggestion.value).not.toBeNull())

        typeName(result, 'חלב ')
        expect(result.current.suggestion.stale).toBe(false)

        typeName(result, 'גבינה')
        expect(result.current.suggestion.stale).toBe(true)
        await act(async () => new Promise((resolve) => setTimeout(resolve, 700)))
        act(() => result.current.suggestion.refresh())

        await waitFor(() => expect(result.current.suggestion.stale).toBe(false))
    })
})
