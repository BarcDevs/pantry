/**
 * @jest-environment node
 */
jest.mock('@/models/recipe.model', () => ({
    RecipeModel: {
        findOneAndUpdate: jest.fn()
    }
}))

import { auth } from '@/lib/auth'

import { RecipeModel } from '@/models/recipe.model'

import { updateRecipe } from '../update-recipe'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockFindOneAndUpdate = (
    RecipeModel.findOneAndUpdate as jest.Mock
)

const leanChain = (result: unknown) => ({
    lean: jest.fn().mockResolvedValue(result)
})

const recipeId = '507f1f77bcf86cd799439011'

describe('updateRecipe', () => {
    beforeEach(() => jest.clearAllMocks())

    it('throws when unauthenticated', async () => {
        mockAuth.mockResolvedValue(null as never)
        await expect(updateRecipe(recipeId, {
            isFavorite: true
        })).rejects.toThrow()
        expect(mockFindOneAndUpdate).not.toHaveBeenCalled()
    })

    it('scopes the update to the recipe owner and never touches rating', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockFindOneAndUpdate.mockReturnValue(leanChain({
            _id: { toString: () => recipeId },
            title: 'עדכון',
            isFavorite: true
        }))

        await updateRecipe(recipeId, {
            title: 'עדכון',
            isFavorite: true,
            // @ts-expect-error rating must not be settable
            rating: 5
        })

        expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
            { _id: recipeId, userId: 'user_123' },
            expect.objectContaining({
                title: 'עדכון',
                isFavorite: true
            }),
            expect.objectContaining({ returnDocument: 'after' })
        )
        const [, updateArg] = mockFindOneAndUpdate.mock.calls[0]
        expect(updateArg).not.toHaveProperty('rating')
    })

    it('throws when the recipe is not found or not owned', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockFindOneAndUpdate.mockReturnValue(leanChain(null))

        await expect(updateRecipe(recipeId, {
            isFavorite: true
        })).rejects.toThrow()
    })
})
