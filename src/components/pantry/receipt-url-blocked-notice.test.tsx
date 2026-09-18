import {
    render,
    screen
} from '@testing-library/react'

import { ReceiptUrlBlockedNotice } from '@/components/pantry/receipt-url-blocked-notice'

import { routes } from '@/constants/routes'
import { pantryTexts } from '@/constants/texts/pantry'

describe('ReceiptUrlBlockedNotice', () => {
    it('links the hint to the paste-text tab', () => {
        render(<ReceiptUrlBlockedNotice/>)

        expect(screen.getByRole('link', { name: pantryTexts.receiptReview.urlBlockedHintLink }))
            .toHaveAttribute('href', `${routes.addPaste}?tab=text`)
        expect(screen.getByText(pantryTexts.receiptReview.urlBlockedError))
            .toBeInTheDocument()
    })
})
