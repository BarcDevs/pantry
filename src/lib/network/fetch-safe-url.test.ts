/**
 * @jest-environment node
 */
jest.mock('node:dns/promises', () => ({
    lookup: jest.fn()
}))
jest.mock('undici', () => ({
    Agent: jest.fn((options: unknown) => ({ options }))
}))

import { lookup } from 'node:dns/promises'

import { fetchSafeUrl } from './fetch-safe-url'

const mockLookup = lookup as jest.Mock
const mockFetch = jest.fn()
const publicAddress = {
    address: '93.184.216.34',
    family: 4
}
const fetchOptions = {
    maxBytes: 1000,
    allowedContentTypes: ['text/html']
}

const makeResponse = (
    status: number,
    options: {
        location?: string
        body?: string
    } = {}
): unknown => {
    const bytes = new TextEncoder().encode(options.body ?? '')
    let sent = false
    return {
        status,
        ok: status >= 200 && status < 300,
        headers: {
            get: (name: string) => {
                if (name === 'content-type') return 'text/html'
                if (name === 'location') return options.location ?? null
                return null
            }
        },
        body: {
            getReader: () => ({
                read: async () => {
                    if (sent) return { done: true, value: undefined }
                    sent = true
                    return { done: false, value: bytes }
                },
                cancel: async () => undefined
            })
        }
    }
}

const fetchedUrls = (): string[] => mockFetch.mock.calls.map(
    ([url]) => String(url)
)

describe('fetchSafeUrl', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = mockFetch as never
        mockLookup.mockResolvedValue([publicAddress])
    })

    it('returns the body of a public page', async () => {
        mockFetch.mockResolvedValue(makeResponse(200, { body: 'hello' }))
        await expect(
            fetchSafeUrl('https://example.com/a', fetchOptions)
        ).resolves.toEqual({
            body: 'hello',
            finalUrl: 'https://example.com/a'
        })
    })

    it('blocks a redirect to a private IP literal without fetching it', async () => {
        mockFetch.mockResolvedValueOnce(
            makeResponse(302, { location: 'http://127.0.0.1/admin' })
        )
        mockLookup.mockImplementation(async (hostname: string) => [
            hostname === '127.0.0.1'
                ? {
                    address: '127.0.0.1',
                    family: 4
                }
                : publicAddress
        ])
        const result = await fetchSafeUrl('https://example.com/a', fetchOptions)
        expect(result).toBeNull()
        expect(fetchedUrls()).toEqual(['https://example.com/a'])
    })

    it('blocks a redirect to a hostname resolving to loopback', async () => {
        mockFetch.mockResolvedValueOnce(
            makeResponse(301, { location: 'https://evil.example.org/x' })
        )
        mockLookup.mockImplementation(async (hostname: string) => [
            hostname === 'evil.example.org'
                ? {
                    address: '127.0.0.1',
                    family: 4
                }
                : publicAddress
        ])
        const result = await fetchSafeUrl('https://example.com/a', fetchOptions)
        expect(result).toBeNull()
        expect(fetchedUrls()).toEqual(['https://example.com/a'])
    })

    it('blocks a hostname with mixed public and private records', async () => {
        mockLookup.mockResolvedValue([
            publicAddress,
            {
                address: '10.0.0.5',
                family: 4
            }
        ])
        const result = await fetchSafeUrl('https://example.com/a', fetchOptions)
        expect(result).toBeNull()
        expect(mockFetch).not.toHaveBeenCalled()
    })

    it.each([
        'file:///etc/passwd',
        'ftp://example.com/file'
    ])('blocks a redirect to %s', async (location) => {
        mockFetch.mockResolvedValueOnce(makeResponse(302, { location }))
        const result = await fetchSafeUrl('https://example.com/a', fetchOptions)
        expect(result).toBeNull()
        expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    it('returns null after more than 3 redirects', async () => {
        mockFetch.mockImplementation(async () => makeResponse(302, { location: '/next' }))
        const result = await fetchSafeUrl('https://example.com/a', fetchOptions)
        expect(result).toBeNull()
        expect(mockFetch).toHaveBeenCalledTimes(4)
    })

    it('follows up to 3 redirects', async () => {
        mockFetch
            .mockResolvedValueOnce(makeResponse(302, { location: '/b' }))
            .mockResolvedValueOnce(makeResponse(302, { location: '/c' }))
            .mockResolvedValueOnce(makeResponse(302, { location: '/d' }))
            .mockResolvedValueOnce(makeResponse(200, { body: 'done' }))
        await expect(
            fetchSafeUrl('https://example.com/a', fetchOptions)
        ).resolves.toEqual({
            body: 'done',
            finalUrl: 'https://example.com/d'
        })
    })

    it('pins the connection to the checked IP', async () => {
        mockFetch.mockResolvedValue(makeResponse(200, { body: 'ok' }))
        await fetchSafeUrl('https://example.com/a', fetchOptions)
        const { dispatcher } = mockFetch.mock.calls[0][1]
        const callback = jest.fn()
        dispatcher.options.connect.lookup('example.com', {}, callback)
        expect(callback).toHaveBeenCalledWith(null, [publicAddress])
    })
})
