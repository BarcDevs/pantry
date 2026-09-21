/**
 * @jest-environment node
 */
import {
    excludedSearchDomains,
    SearchLanguage
} from '@/constants/search'

import { createYouSearchClient } from '../you-search-client'

const mockFetch = jest.fn()

const jsonResponse = (body: unknown, status = 200) => ({
    status,
    json: jest.fn().mockResolvedValue(body)
})

describe('createYouSearchClient', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = mockFetch as never
    })

    const client = createYouSearchClient('test-key')

    it('posts the query with key, language and exclusions and maps results', async () => {
        mockFetch.mockResolvedValue(jsonResponse({
            results: {
                web: [
                    {
                        url: 'https://a.co.il/r1',
                        title: 'One',
                        snippets: ['ignored']
                    }
                ]
            }
        }))

        const results = await client.search('מתכון', { language: SearchLanguage.Hebrew })

        expect(results).toEqual([{
            url: 'https://a.co.il/r1',
            title: 'One'
        }])
        const [url, init] = mockFetch.mock.calls[0]
        expect(url).toBe('https://ydc-index.io/v1/search')
        expect(init.method).toBe('POST')
        expect(init.headers['X-API-Key']).toBe('test-key')
        expect(init.signal).toBeInstanceOf(AbortSignal)
        expect(JSON.parse(init.body)).toEqual({
            query: 'מתכון',
            count: 10,
            language: 'HE',
            exclude_domains: excludedSearchDomains,
            safesearch: 'moderate'
        })
    })

    it('returns an empty list when the response has no web results', async () => {
        mockFetch.mockResolvedValue(jsonResponse({ results: {} }))
        expect(await client.search('q', { language: SearchLanguage.English })).toEqual([])
    })

    it('throws on a non-200 status', async () => {
        mockFetch.mockResolvedValue(jsonResponse({}, 429))
        await expect(
            client.search('q', { language: SearchLanguage.Hebrew })
        ).rejects.toThrow('429')
    })

    it('propagates a timeout or network error', async () => {
        mockFetch.mockRejectedValue(new DOMException('timed out', 'TimeoutError'))
        await expect(
            client.search('q', { language: SearchLanguage.Hebrew })
        ).rejects.toThrow('timed out')
    })

    it('throws on a malformed json body', async () => {
        mockFetch.mockResolvedValue({
            status: 200,
            json: jest.fn().mockRejectedValue(new SyntaxError('bad json'))
        })
        await expect(
            client.search('q', { language: SearchLanguage.Hebrew })
        ).rejects.toThrow('bad json')
    })

    it('drops non-http urls and dedupes by host and path', async () => {
        mockFetch.mockResolvedValue(jsonResponse({
            results: {
                web: [
                    {
                        url: 'ftp://a.com/x',
                        title: 'ftp'
                    },
                    {
                        url: 'javascript:alert(1)',
                        title: 'js'
                    },
                    {
                        url: 'not a url',
                        title: 'bad'
                    },
                    {
                        url: 'https://a.com/r?utm=1',
                        title: 'first'
                    },
                    {
                        url: 'http://a.com/r?utm=2',
                        title: 'dupe'
                    },
                    {
                        url: 'https://a.com/other',
                        title: 'other'
                    },
                    { title: 'no url' }
                ]
            }
        }))

        const results = await client.search('q', { language: SearchLanguage.Hebrew })

        expect(results.map((result) => result.title)).toEqual([
            'first',
            'other'
        ])
    })
})
