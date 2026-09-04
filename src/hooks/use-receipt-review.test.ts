import { act, renderHook } from '@testing-library/react'

jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
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

import { useRouter } from 'next/navigation'

import { ItemSource } from '@/types/enums'
import type { AddPantryItemOutcome } from '@/types/pantry-item'

import { addPantryItems } from '@/actions/pantry/add-pantry-items'

import { useReceiptReview } from './use-receipt-review'

const mockPush = jest.fn()
const mockUseRouter = useRouter as jest.Mock
const mockAddPantryItems = addPantryItems as jest.Mock

const scanned = [
    {
        name: 'עגבניות',
        quantity: 1,
        unit: 'kg' as const
    },
    {
        name: 'מלפפונים',
        quantity: 2,
        unit: 'units' as const
    }
]

describe('useReceiptReview', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockUseRouter.mockReturnValue({ push: mockPush })
    })

    it('does not resubmit already-created rows after a partial-duplicate save', async () => {
        const outcomes: AddPantryItemOutcome[] = [
            {
                status: 'created',
                item: { _id: 'p1' } as never
            },
            {
                status: 'duplicate',
                existing: {
                    _id: 'p2',
                    name: 'מלפפונים'
                } as never,
                incoming: {
                    name: 'מלפפונים',
                    storage: 'pantry' as never,
                    type: null,
                    quantity: 2,
                    unit: 'units' as never
                }
            }
        ]
        mockAddPantryItems.mockResolvedValue(outcomes)

        const { result } = renderHook(
            () => useReceiptReview(ItemSource.ReceiptScan)
        )

        act(() => result.current.setScannedItems(scanned))
        expect(result.current.rows).toHaveLength(2)

        await act(async () => result.current.confirm())

        expect(result.current.rows).toHaveLength(1)
        expect(result.current.rows[0]?.name).toBe('מלפפונים')
        expect(result.current.duplicates).toHaveLength(1)
        expect(mockPush).not.toHaveBeenCalled()

        mockAddPantryItems.mockResolvedValue([
            {
                status: 'created',
                item: { _id: 'p2' } as never
            }
        ])

        const pendingDuplicate = result.current.duplicates[0]
        if (!pendingDuplicate) throw new Error('expected a pending duplicate')

        await act(async () => (
            result.current.resolveDuplicate(pendingDuplicate, 'merge')
        ))

        expect(result.current.rows).toHaveLength(0)
        expect(mockPush).toHaveBeenCalledTimes(1)

        expect(mockAddPantryItems).toHaveBeenCalledTimes(2)
        const secondCallItems = mockAddPantryItems.mock.calls[1]?.[0]
        expect(secondCallItems).toHaveLength(1)
    })
})
