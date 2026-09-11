import {
    fireEvent,
    render,
    screen
} from '@testing-library/react'

import { StorageLocation } from '@/types/enums'
import type {
    ReceiptReviewRow,
    ReceiptReviewRowActions
} from '@/types/receipt-review-row'

import { ReceiptReviewList } from './receipt-review-list'

jest.mock('@/actions/pantry/suggest-storage', () => ({
    suggestStorage: jest.fn()
}))

const rows: ReceiptReviewRow[] = [
    {
        id: '1',
        name: 'עגבניות',
        quantity: 1,
        unit: 'kg',
        storage: StorageLocation.Pantry,
        type: null,
        expiryDate: '',
        storageSuggestion: null,
        included: true
    },
    {
        id: '2',
        name: 'מלפפונים',
        quantity: 2,
        unit: 'units',
        storage: StorageLocation.Pantry,
        type: null,
        expiryDate: '',
        storageSuggestion: null,
        included: false
    }
]

const noop = () => undefined

const baseRowActions: ReceiptReviewRowActions = {
    onToggle: noop,
    onQuantityChange: noop,
    onUnitChange: noop,
    onEditSave: noop,
    onRemove: noop
}

describe('ReceiptReviewList', () => {
    it('renders a row per item and calls onToggle when its checkbox changes', () => {
        const onToggle = jest.fn()
        render(
            <ReceiptReviewList
                rows={rows}
                isSubmitting={false}
                rowActions={{ ...baseRowActions, onToggle }}
                onConfirm={noop}
                onCancel={noop}
            />
        )

        expect(screen.getByText('עגבניות')).toBeInTheDocument()
        expect(screen.getByText('מלפפונים')).toBeInTheDocument()

        const toggles = screen.getAllByRole('button', { name: /עגבניות|מלפפונים/ })
        fireEvent.click(toggles[0])
        expect(onToggle).toHaveBeenCalledWith('1')
    })

    it('calls onRemove when a row remove button is clicked', () => {
        const onRemove = jest.fn()
        render(
            <ReceiptReviewList
                rows={rows}
                isSubmitting={false}
                rowActions={{ ...baseRowActions, onRemove }}
                onConfirm={noop}
                onCancel={noop}
            />
        )

        const removeButtons = screen.getAllByRole('button', { name: '' })
        fireEvent.click(removeButtons[removeButtons.length - 1])
        expect(onRemove).toHaveBeenCalledWith('2')
    })

    it('disables the confirm button when no rows are included', () => {
        const allExcluded = rows.map((row) => ({ ...row, included: false }))
        render(
            <ReceiptReviewList
                rows={allExcluded}
                isSubmitting={false}
                rowActions={baseRowActions}
                onConfirm={noop}
                onCancel={noop}
            />
        )

        expect(screen.getByText('הוספה למזווה')).toBeDisabled()
    })
})
