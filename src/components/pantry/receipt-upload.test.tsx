import {
    fireEvent,
    render,
    screen,
    waitFor
} from '@testing-library/react'

jest.mock('@/actions/pantry/scan-receipt', () => ({
    scanReceipt: jest.fn()
}))
jest.mock('@/lib/pantry/file-to-base64', () => ({
    fileToBase64: jest.fn(() => Promise.resolve('base64data'))
}))

import { scanReceipt } from '@/actions/pantry/scan-receipt'

import { ReceiptUpload } from './receipt-upload'

const mockScanReceipt = scanReceipt as jest.Mock

describe('ReceiptUpload', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('calls onScanned with the items returned by scanReceipt', async () => {
        const items = [
            {
                name: 'עגבניות',
                quantity: 1,
                unit: 'kg'
            }
        ]
        mockScanReceipt.mockResolvedValue(items)
        const onScanned = jest.fn()

        render(<ReceiptUpload onScanned={onScanned}/>)

        const file = new File(['x'], 'receipt.jpg', { type: 'image/jpeg' })
        const input = document.getElementById(
            'receipt-file-input'
        ) as HTMLInputElement

        fireEvent.change(input, { target: { files: [file] } })

        await waitFor(() => {
            expect(onScanned).toHaveBeenCalledWith(items)
        })
        expect(mockScanReceipt).toHaveBeenCalledWith('base64data', 'image/jpeg')
    })

    it('shows an error when scanning fails', async () => {
        mockScanReceipt.mockRejectedValue(new Error('fail'))
        const onScanned = jest.fn()

        render(<ReceiptUpload onScanned={onScanned}/>)

        const file = new File(['x'], 'receipt.jpg', { type: 'image/jpeg' })
        const input = document.getElementById(
            'receipt-file-input'
        ) as HTMLInputElement

        fireEvent.change(input, { target: { files: [file] } })

        await waitFor(() => {
            expect(screen.getByText(/נכשלה/)).toBeInTheDocument()
        })
        expect(onScanned).not.toHaveBeenCalled()
    })
})
