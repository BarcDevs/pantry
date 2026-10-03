jest.mock('ai', () => ({
    generateText: jest.fn()
}))
jest.mock('@/config/ai', () => ({
    aiModel: {},
    google: {
        tools: {
            googleSearch: jest.fn(() => ({}))
        }
    }
}))
jest.mock('@/config/env', () => ({
    __esModule: true,
    default: { e2eMockAi: false }
}))

import { generateText } from 'ai'

import env from '@/config/env'

import { searchRecipeImage } from './search-recipe-image'

const mockGenerateText = generateText as jest.Mock
const mockEnv = env as { e2eMockAi: boolean }
const mockFetch = jest.fn()

describe('searchRecipeImage', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockEnv.e2eMockAi = false
        global.fetch = mockFetch
    })

    it('returns the og:image url scraped from the first grounded page', async () => {
        mockGenerateText.mockResolvedValue({
            providerMetadata: {
                google: {
                    groundingMetadata: {
                        groundingChunks: [
                            { web: { uri: 'https://redirect.co.il/a' } }
                        ]
                    }
                }
            }
        })
        mockFetch.mockResolvedValue({
            ok: true,
            url: 'https://a.co.il/recipe',
            text: () => Promise.resolve(
                '<meta property="og:image" content="https://a.co.il/dish.jpg">'
            )
        })

        const result = await searchRecipeImage('פסטה', ['עגבניה'])

        expect(result).toBe('https://a.co.il/dish.jpg')
    })

    it('falls through to the next chunk when a page has no og:image', async () => {
        mockGenerateText.mockResolvedValue({
            providerMetadata: {
                google: {
                    groundingMetadata: {
                        groundingChunks: [
                            { web: { uri: 'https://redirect.co.il/a' } },
                            { web: { uri: 'https://redirect.co.il/b' } }
                        ]
                    }
                }
            }
        })
        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                url: 'https://a.co.il/recipe',
                text: () => Promise.resolve('<html></html>')
            })
            .mockResolvedValueOnce({
                ok: true,
                url: 'https://b.co.il/recipe',
                text: () => Promise.resolve(
                    '<meta property="og:image" content="https://b.co.il/dish.jpg">'
                )
            })

        const result = await searchRecipeImage('פסטה', ['עגבניה'])

        expect(result).toBe('https://b.co.il/dish.jpg')
    })

    it('returns null when no grounding chunks are present', async () => {
        mockGenerateText.mockResolvedValue({
            providerMetadata: {
                google: { groundingMetadata: { groundingChunks: [] } }
            }
        })

        const result = await searchRecipeImage('פסטה', ['עגבניה'])

        expect(result).toBeNull()
        expect(mockFetch).not.toHaveBeenCalled()
    })

    it('returns null when providerMetadata is missing', async () => {
        mockGenerateText.mockResolvedValue({})

        const result = await searchRecipeImage('פסטה', ['עגבניה'])

        expect(result).toBeNull()
    })

    it('uses the mock under E2E_MOCK_AI without calling generateText', async () => {
        mockEnv.e2eMockAi = true

        const result = await searchRecipeImage(
            'פסטה',
            ['עגבניה'],
            () => 'https://mock.co.il/dish.jpg'
        )

        expect(result).toBe('https://mock.co.il/dish.jpg')
        expect(mockGenerateText).not.toHaveBeenCalled()
    })
})
