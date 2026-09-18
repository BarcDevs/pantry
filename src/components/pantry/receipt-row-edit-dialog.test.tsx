import {
    fireEvent,
    render,
    screen
} from '@testing-library/react'

import type { ReceiptReviewRow } from '@/types/receipt-review-row'

import { ReceiptRowEditDialog } from './receipt-row-edit-dialog'

jest.mock('@/actions/pantry/suggest-storage', () => ({
    suggestStorage: jest.fn()
}))

const row = {
    id: 'row-1',
    name: 'עגבניות',
    quantity: 1,
    unit: 'kg',
    storage: 'fridge',
    type: null,
    expiryDate: '',
    storageSuggestion: null,
    included: true
} as unknown as ReceiptReviewRow

describe('ReceiptRowEditDialog Enter', () => {
    it('saves and closes from the name field', () => {
        const onSave = jest.fn()
        const onOpenChange = jest.fn()
        render(
            <ReceiptRowEditDialog
                row={row}
                open
                onOpenChange={onOpenChange}
                onSave={onSave}
            />
        )

        fireEvent.keyDown(screen.getByDisplayValue('עגבניות'), { key: 'Enter' })

        expect(onSave).toHaveBeenCalledTimes(1)
        expect(onOpenChange).toHaveBeenCalledWith(false)
    })
})
