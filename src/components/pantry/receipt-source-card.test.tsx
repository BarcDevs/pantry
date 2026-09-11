import {
    fireEvent,
    render,
    screen
} from '@testing-library/react'

import { ReceiptSourceCard } from './receipt-source-card'

describe('ReceiptSourceCard', () => {
    it('shows the item count and calls onToggleAll / onClearAll from their buttons', () => {
        const onToggleAll = jest.fn()
        const onClearAll = jest.fn()
        render(
            <ReceiptSourceCard
                icon={'🧾'}
                label={'סריקת קבלה'}
                itemCount={4}
                allSelected={false}
                onToggleAll={onToggleAll}
                onClearAll={onClearAll}
            />
        )

        expect(screen.getByText('4 מוצרים זוהו')).toBeInTheDocument()

        fireEvent.click(screen.getByText('בחר הכל'))
        fireEvent.click(screen.getByText('נקה הכל'))
        expect(onToggleAll).toHaveBeenCalled()
        expect(onClearAll).toHaveBeenCalled()
    })

    it('shows the deselect label when everything is already selected', () => {
        render(
            <ReceiptSourceCard
                icon={'🧾'}
                label={'סריקת קבלה'}
                itemCount={4}
                allSelected
                onToggleAll={() => undefined}
                onClearAll={() => undefined}
            />
        )

        expect(screen.getByText('בטל בחירה')).toBeInTheDocument()
    })
})
