/**
 * @jest-environment node
 */
jest.mock('@clerk/nextjs/server', () => ({
    auth: jest.fn()
}))
jest.mock('@/lib/mongodb', () => ({
    __esModule: true,
    default: jest.fn()
}))
jest.mock('@/models/recipe.model', () => ({
    RecipeModel: {
        find: jest.fn()
    }
}))
jest.mock('@/models/pantry-item.model', () => ({
    PantryItemModel: {
        find: jest.fn()
    }
}))

import { auth } from '@clerk/nextjs/server'

import { PantryItemModel } from '@/models/pantry-item.model'
import { RecipeModel } from '@/models/recipe.model'

import { getRecipes } from '../get-recipes'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockFind = RecipeModel.find as jest.Mock
const mockPantryFind = PantryItemModel.find as jest.Mock

const chain = (result: unknown) => ({
    sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(result)
    })
})

describe('getRecipes', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockPantryFind.mockReturnValue({ lean: jest.fn().mockResolvedValue([]) })
    })

    it('returns empty array when unauthenticated', async () => {
        mockAuth.mockResolvedValue({ userId: null } as never)
        expect(await getRecipes()).toEqual([])
        expect(mockFind).not.toHaveBeenCalled()
    })

    it('queries recipes scoped to the current user', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)
        const docs = [{
            _id: { toString: () => 'r1' },
            title: 'a',
            ingredients: []
        }]
        mockFind.mockReturnValue(chain(docs))

        expect(await getRecipes()).toEqual([{
            _id: 'r1',
            title: 'a',
            ingredients: []
        }])
        expect(mockFind).toHaveBeenCalledWith({ userId: 'user_123' })
    })

    it('filters by search, favorite, min rating, and source', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)
        mockFind.mockReturnValue(chain([]))

        await getRecipes({
            search: 'פסטה',
            isFavorite: true,
            minRating: 4,
            source: 'ai_generated'
        })

        expect(mockFind).toHaveBeenCalledWith(
            expect.objectContaining({
                userId: 'user_123',
                title: expect.objectContaining({
                    $options: 'i'
                }),
                isFavorite: true,
                rating: { $gte: 4 },
                source: 'ai_generated'
            })
        )
    })
})
