jest.mock('ai', () => ({
    generateText: jest.fn()
}))
jest.mock('@/config/ai', () => {
    const google = jest.fn(() => ({}))
    google.tools = {
        googleSearch: jest.fn(() => ({}))
    }
    return { google }
})
jest.mock('@/config/env', () => ({
    __esModule: true,
    default: { e2eMockAi: false, geminiImageSearchModelId: 'gemini-3.1-flash-image' }
}))

import { generateText } from 'ai'

import env from '@/config/env'

import { searchRecipeImage } from './search-recipe-image'

const mockGenerateText = generateText as jest.Mock
const mockEnv = env as { e2eMockAi: boolean }

describe('searchRecipeImage', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockEnv.e2eMockAi = false
    })

    it('returns the first valid grounded image url', async () => {
        mockGenerateText.mockResolvedValue({
            providerMetadata: {
                google: {
                    groundingMetadata: {
                        groundingChunks: [
                            { web: { uri: 'https://a.co.il' } },
                            { image: { imageUri: 'https://a.co.il/dish.jpg' } }
                        ]
                    }
                }
            }
        })

        const result = await searchRecipeImage('פסטה', ['עגבניה'])

        expect(result).toBe('https://a.co.il/dish.jpg')
    })

    it('returns null when no grounding chunks have an image', async () => {
        mockGenerateText.mockResolvedValue({
            providerMetadata: {
                google: { groundingMetadata: { groundingChunks: [] } }
            }
        })

        const result = await searchRecipeImage('פסטה', ['עגבניה'])

        expect(result).toBeNull()
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
