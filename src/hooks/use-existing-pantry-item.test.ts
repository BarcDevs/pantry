import {
    renderHook,
    waitFor
} from '@testing-library/react'

jest.mock('@/actions/pantry/find-existing-pantry-item', () => ({
    findExistingPantryItem: jest.fn()
}))

import { findExistingPantryItem } from '@/actions/pantry/find-existing-pantry-item'

import { useExistingPantryItem } from './use-existing-pantry-item'

const mockFind = findExistingPantryItem as jest.Mock

describe('useExistingPantryItem', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        jest.spyOn(console, 'error').mockImplementation(() => undefined)
    })

    afterEach(() => jest.restoreAllMocks())

    it('returns the existing item for the name', async () => {
        const item = { _id: 'i1', name: 'חלב' }
        mockFind.mockResolvedValue(item)

        const { result } = renderHook(() => useExistingPantryItem('חלב'))

        await waitFor(() => expect(result.current).toEqual(item))
    })

    it('drops a stale item when a later lookup for the same name fails', async () => {
        mockFind.mockResolvedValueOnce({ _id: 'i1', name: 'חלב' })
        const { result, rerender } = renderHook(
            ({ name }) => useExistingPantryItem(name),
            { initialProps: { name: 'חלב' } }
        )
        await waitFor(() => expect(result.current).not.toBeNull())

        mockFind.mockResolvedValueOnce(null)
        rerender({ name: 'חלבון' })
        await waitFor(() => expect(mockFind).toHaveBeenCalledTimes(2))
        mockFind.mockRejectedValueOnce(new Error('db down'))
        rerender({ name: 'חלב' })

        await waitFor(() => expect(result.current).toBeNull())
    })
})
