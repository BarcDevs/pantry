import {
    act,
    fireEvent,
    render,
    screen
} from '@testing-library/react'

import { pantryTexts } from '@/constants/texts/pantry'

import { parseReceiptUrl } from '@/actions/pantry/parse-receipt-url'

import { ReceiptPasteView } from './receipt-paste-view'

let mockTab: string | null = null

jest.mock('next/navigation', () => ({
    useSearchParams: () => ({ get: () => mockTab })
}))
jest.mock('@/actions/pantry/parse-receipt-url', () => ({
    parseReceiptUrl: jest.fn()
}))
jest.mock('@/actions/pantry/parse-receipt-text', () => ({
    parseReceiptText: jest.fn()
}))
jest.mock('@/components/pantry/receipt-review-shell', () => ({
    ReceiptReviewShell: ({ children }: {
        children: (props: { onScanned: () => Promise<void> }) => unknown
    }) => children({ onScanned: async () => undefined })
}))

const mockParseUrl = parseReceiptUrl as jest.Mock
const texts = pantryTexts.receiptReview

const submitUrl = async () => {
    fireEvent.change(
        screen.getByPlaceholderText(texts.urlPlaceholder),
        { target: { value: 'https://example.com/receipt' } }
    )
    await act(async () => {
        fireEvent.click(screen.getByText(texts.urlSubmit))
    })
}

describe('ReceiptPasteView', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockTab = null
    })

    it('clears a stale blocked-url error when the text tab opens', async () => {
        mockParseUrl.mockResolvedValue({
            items: [],
            fallbackToManual: true,
            isBlocked: true
        })
        const { rerender } = render(<ReceiptPasteView/>)
        await submitUrl()
        expect(screen.getByText(pantryTexts.receiptReview.urlBlockedHintLink)).toBeInTheDocument()

        mockTab = 'text'
        rerender(<ReceiptPasteView/>)

        expect(screen.queryByText(texts.textFallback)).not.toBeInTheDocument()
        expect(screen.queryByText(texts.urlBlockedHintLink)).not.toBeInTheDocument()

        mockTab = null
        rerender(<ReceiptPasteView/>)
        expect(screen.queryByText(texts.urlBlockedHintLink)).not.toBeInTheDocument()
    })
})
