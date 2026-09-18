/**
 * @jest-environment node
 */
jest.mock('@/lib/ai/gemini', () => ({
    generateStructured: jest.fn()
}))

import { generateStructured } from '@/lib/ai/gemini'
import { auth } from '@/lib/auth'

import { scanReceipt } from '../scan-receipt'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockGenerateStructured = generateStructured as jest.Mock

const items = [
    {
        name: 'עגבניות',
        quantity: 1,
        unit: 'kg'
    },
    {
        name: 'חלב',
        quantity: 2,
        unit: 'units'
    }
]

describe('scanReceipt', () => {
    beforeEach(() => jest.clearAllMocks())

    it('throws when unauthenticated', async () => {
        mockAuth.mockResolvedValue(null as never)
        await expect(
            scanReceipt('aGVsbG8=', 'image/jpeg')
        ).rejects.toThrow()
        expect(mockGenerateStructured).not.toHaveBeenCalled()
    })

    it('throws on empty image data', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        await expect(scanReceipt('', 'image/jpeg')).rejects.toThrow()
        expect(mockGenerateStructured).not.toHaveBeenCalled()
    })

    it('returns extracted items from the receipt image', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockGenerateStructured.mockResolvedValue({ items })

        const result = await scanReceipt('aGVsbG8=', 'image/jpeg')

        expect(result).toEqual(items)
        expect(mockGenerateStructured).toHaveBeenCalledWith(
            expect.any(String),
            expect.anything(),
            expect.any(Function),
            0,
            {
                base64: 'aGVsbG8=',
                mimeType: 'image/jpeg'
            }
        )
    })
})
