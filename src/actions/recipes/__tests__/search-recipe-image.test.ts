/**
 * @jest-environment node
 */
jest.mock('@/lib/ai/search-recipe-image', () => ({
    searchRecipeImage: jest.fn()
}))

import { searchRecipeImage as searchRecipeImageViaAi } from '@/lib/ai/search-recipe-image'
import { auth } from '@/lib/auth'

import { searchRecipeImage } from '../search-recipe-image'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockSearchRecipeImageViaAi = searchRecipeImageViaAi as jest.Mock

describe('searchRecipeImage action', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
    })

    it('throws when unauthenticated', async () => {
        mockAuth.mockResolvedValue(null as never)
        await expect(searchRecipeImage({
            title: 'פסטה',
            ingredients: ['עגבניה']
        })).rejects.toThrow()
    })

    it('rejects an empty ingredients list', async () => {
        await expect(searchRecipeImage({
            title: 'פסטה',
            ingredients: []
        })).rejects.toThrow()
    })

    it('returns the found image url', async () => {
        mockSearchRecipeImageViaAi.mockResolvedValue('https://a.co.il/dish.jpg')

        const result = await searchRecipeImage({
            title: 'פסטה',
            ingredients: ['עגבניה']
        })

        expect(result).toEqual({ imageUrl: 'https://a.co.il/dish.jpg' })
        expect(mockSearchRecipeImageViaAi).toHaveBeenCalledWith(
            'פסטה',
            ['עגבניה'],
            expect.any(Function)
        )
    })

    it('returns null when nothing is found', async () => {
        mockSearchRecipeImageViaAi.mockResolvedValue(null)

        const result = await searchRecipeImage({
            title: 'פסטה',
            ingredients: ['עגבניה']
        })

        expect(result).toEqual({ imageUrl: null })
    })
})
