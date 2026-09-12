/**
 * @jest-environment node
 */
jest.mock('@/lib/auth', () => ({
    auth: jest.fn()
}))
jest.mock('@/lib/ai/gemini', () => ({
    generateStructured: jest.fn()
}))
jest.mock('node:dns/promises', () => ({
    lookup: jest.fn()
}))

import { lookup } from 'node:dns/promises'

import { generateStructured } from '@/lib/ai/gemini'
import { auth } from '@/lib/auth'

import { parseReceiptUrl } from '../parse-receipt-url'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockGenerateStructured = generateStructured as jest.Mock
const mockLookup = lookup as jest.Mock
const mockFetch = jest.fn()

const items = [
    {
        name: 'עגבניות',
        quantity: 1,
        unit: 'kg'
    }
]

const encoder = new TextEncoder()

const makeResponse = (
    text: string,
    options: {
        status?: number
        contentType?: string
        location?: string
    } = {}
): unknown => {
    const status = options.status ?? 200
    const bytes = encoder.encode(text)
    let sent = false
    return {
        status,
        ok: status >= 200 && status < 300,
        headers: {
            get: (name: string) => {
                if (name === 'content-type') {
                    return options.contentType ?? 'text/html'
                }
                if (name === 'location') {
                    return options.location ?? null
                }
                return null
            }
        },
        body: {
            getReader: () => ({
                read: async () => {
                    if (sent) {
                        return { done: true, value: undefined }
                    }
                    sent = true
                    return { done: false, value: bytes }
                },
                cancel: async () => undefined
            })
        }
    }
}

describe('parseReceiptUrl', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = mockFetch as never
        mockLookup.mockResolvedValue([{ address: '93.184.216.34', family: 4 }])
    })

    it('throws when unauthenticated', async () => {
        mockAuth.mockResolvedValue(null as never)
        await expect(
            parseReceiptUrl('https://example.com')
        ).rejects.toThrow()
        expect(mockFetch).not.toHaveBeenCalled()
    })

    it('throws on an invalid url', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        await expect(
            parseReceiptUrl('not-a-url')
        ).rejects.toThrow()
        expect(mockFetch).not.toHaveBeenCalled()
    })

    it('returns extracted items from the fetched page', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockFetch.mockResolvedValue(
            makeResponse('<html><body>עגבניות 1kg</body></html>')
        )
        mockGenerateStructured.mockResolvedValue({ items })

        const result = await parseReceiptUrl('https://example.com/receipt')

        expect(result).toEqual({ items, fallbackToManual: false })
        expect(mockGenerateStructured).toHaveBeenCalledWith(
            expect.stringContaining('עגבניות 1kg'),
            expect.anything(),
            expect.any(Function),
            0
        )
    })

    it('returns fallbackToManual when the fetch response is not ok', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockFetch.mockResolvedValue(makeResponse('', { status: 500 }))

        const result = await parseReceiptUrl('https://example.com/receipt')

        expect(result).toEqual({ items: [], fallbackToManual: true })
        expect(mockGenerateStructured).not.toHaveBeenCalled()
    })

    it('returns fallbackToManual when fetch throws', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockFetch.mockRejectedValue(new Error('network error'))

        const result = await parseReceiptUrl('https://example.com/receipt')

        expect(result).toEqual({ items: [], fallbackToManual: true })
        expect(mockGenerateStructured).not.toHaveBeenCalled()
    })

    it.each([
        'http://169.254.169.254/latest/meta-data/',
        'http://localhost:6379/',
        'http://127.0.0.1/',
        'data:text/plain,hello'
    ])(
        'blocks SSRF-risky target %s without calling fetch',
        async (dangerousUrl) => {
            mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
            mockLookup.mockResolvedValue([{ address: '169.254.169.254', family: 4 }])

            const result = await parseReceiptUrl(dangerousUrl)

            expect(result).toEqual({ items: [], fallbackToManual: true })
            expect(mockFetch).not.toHaveBeenCalled()
            expect(mockGenerateStructured).not.toHaveBeenCalled()
        }
    )

    it('does not follow a redirect to a private address', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockLookup.mockImplementation(async (hostname: string) => (
            hostname === '169.254.169.254'
                ? [{ address: '169.254.169.254', family: 4 }]
                : [{ address: '93.184.216.34', family: 4 }]
        ))
        mockFetch.mockResolvedValueOnce(
            makeResponse('', {
                status: 302,
                location: 'http://169.254.169.254/'
            })
        )

        const result = await parseReceiptUrl('https://example.com/redirect')

        expect(result).toEqual({ items: [], fallbackToManual: true })
        expect(mockFetch).toHaveBeenCalledTimes(1)
        expect(mockGenerateStructured).not.toHaveBeenCalled()
    })

    it('rejects non-html/text content types', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockFetch.mockResolvedValue(
            makeResponse('binary', { contentType: 'application/pdf' })
        )

        const result = await parseReceiptUrl('https://example.com/receipt')

        expect(result).toEqual({ items: [], fallbackToManual: true })
        expect(mockGenerateStructured).not.toHaveBeenCalled()
    })
})
