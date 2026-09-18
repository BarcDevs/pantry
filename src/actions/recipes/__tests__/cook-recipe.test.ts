/**
 * @jest-environment node
 */
jest.mock('@/models/recipe.model', () => ({
    RecipeModel: {
        findOne: jest.fn(),
        findOneAndUpdate: jest.fn()
    }
}))

import { auth } from '@/lib/auth'

import { RecipeModel } from '@/models/recipe.model'

import { cookRecipe } from '../cook-recipe'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockFindOne = RecipeModel.findOne as jest.Mock
const mockFindOneAndUpdate = (
    RecipeModel.findOneAndUpdate as jest.Mock
)

const leanChain = (result: unknown) => ({
    lean: jest.fn().mockResolvedValue(result)
})

const recipeId = '507f1f77bcf86cd799439011'

describe('cookRecipe', () => {
    beforeEach(() => jest.clearAllMocks())

    it('throws when unauthenticated', async () => {
        mockAuth.mockResolvedValue(null as never)
        await expect(cookRecipe(recipeId, 5)).rejects.toThrow()
        expect(mockFindOneAndUpdate).not.toHaveBeenCalled()
    })

    it('throws when the recipe is not found or not owned', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockFindOne.mockReturnValue(leanChain(null))

        await expect(cookRecipe(recipeId, 5)).rejects.toThrow()
    })

    it('appends a history entry and recomputes the average rating', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockFindOne.mockReturnValue(leanChain({
            _id: { toString: () => recipeId },
            userId: 'user_123',
            history: [
                { entryId: 'e1', cookedAt: new Date(), rating: 4 },
                { entryId: 'e2', cookedAt: new Date(), rating: null }
            ]
        }))
        mockFindOneAndUpdate.mockReturnValue(leanChain({
            _id: { toString: () => recipeId },
            rating: 4.5,
            history: []
        }))

        await cookRecipe(recipeId, 5)

        expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
            { _id: recipeId, userId: 'user_123' },
            expect.objectContaining({
                rating: 4.5,
                history: expect.arrayContaining([
                    expect.objectContaining({
                        entryId: 'e1',
                        rating: 4
                    }),
                    expect.objectContaining({
                        entryId: 'e2',
                        rating: null
                    }),
                    expect.objectContaining({
                        rating: 5
                    })
                ])
            }),
            expect.objectContaining({ returnDocument: 'after' })
        )
    })

    it('saves without rating when rating is null and skips it from the average', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockFindOne.mockReturnValue(leanChain({
            _id: { toString: () => recipeId },
            userId: 'user_123',
            history: []
        }))
        mockFindOneAndUpdate.mockReturnValue(leanChain({
            _id: { toString: () => recipeId },
            rating: null,
            history: []
        }))

        await cookRecipe(recipeId, null)

        expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
            { _id: recipeId, userId: 'user_123' },
            expect.objectContaining({ rating: null }),
            expect.anything()
        )
    })
})
