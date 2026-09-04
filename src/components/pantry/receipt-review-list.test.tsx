import {
    fireEvent,
    render,
    screen
} from '@testing-library/react'

import type { ReceiptReviewRow } from '@/types/receipt-review-row'

import { ReceiptReviewList } from './receipt-review-list'

const rows: ReceiptReviewRow[] = [
    {
        id: '1',
        name: 'עגבניות',
        quantity: 1,
        unit: 'kg',
        included: true
    },
    {
        id: '2',
        name: 'מלפפונים',
        quantity: 2,
        unit: 'units',
        included: false
    }
]

const noop = () => undefined

describe('ReceiptReviewList', () => {
    it('renders a row per item and calls onToggle when its checkbox changes', () => {
        const onToggle = jest.fn()
        render(
            <ReceiptReviewList
                rows={rows}
                isSubmitting={false}
                onToggle={onToggle}
                onNameChange={noop}
                onQuantityChange={noop}
                onRemove={noop}
                onSelectAll={noop}
                onClearAll={noop}
                onConfirm={noop}
                onCancel={noop}
            />
        )

        expect(screen.getByDisplayValue('עגבניות')).toBeInTheDocument()
        expect(screen.getByDisplayValue('מלפפונים')).toBeInTheDocument()

        const checkboxes = screen.getAllByRole('checkbox')
        fireEvent.click(checkboxes[0])
        expect(onToggle).toHaveBeenCalledWith('1')
    })

    it('calls onSelectAll / onClearAll from their buttons', () => {
        const onSelectAll = jest.fn()
        const onClearAll = jest.fn()
        render(
            <ReceiptReviewList
                rows={rows}
                isSubmitting={false}
                onToggle={noop}
                onNameChange={noop}
                onQuantityChange={noop}
                onRemove={noop}
                onSelectAll={onSelectAll}
                onClearAll={onClearAll}
                onConfirm={noop}
                onCancel={noop}
            />
        )

        fireEvent.click(screen.getByText('בחר הכל'))
        fireEvent.click(screen.getByText('נקה הכל'))
        expect(onSelectAll).toHaveBeenCalled()
        expect(onClearAll).toHaveBeenCalled()
    })

    it('calls onRemove when a row remove button is clicked', () => {
        const onRemove = jest.fn()
        render(
            <ReceiptReviewList
                rows={rows}
                isSubmitting={false}
                onToggle={noop}
                onNameChange={noop}
                onQuantityChange={noop}
                onRemove={onRemove}
                onSelectAll={noop}
                onClearAll={noop}
                onConfirm={noop}
                onCancel={noop}
            />
        )

        fireEvent.click(screen.getAllByText('✕')[0])
        expect(onRemove).toHaveBeenCalledWith('1')
    })

    it('disables the confirm button when no rows are included', () => {
        const allExcluded = rows.map((row) => ({ ...row, included: false }))
        render(
            <ReceiptReviewList
                rows={allExcluded}
                isSubmitting={false}
                onToggle={noop}
                onNameChange={noop}
                onQuantityChange={noop}
                onRemove={noop}
                onSelectAll={noop}
                onClearAll={noop}
                onConfirm={noop}
                onCancel={noop}
            />
        )

        expect(screen.getByText('הוספה למזווה')).toBeDisabled()
    })
})
