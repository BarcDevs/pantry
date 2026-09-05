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
        findOneAndDelete: jest.fn()
    }
}))

import { auth } from '@clerk/nextjs/server'

import { RecipeModel } from '@/models/recipe.model'

import { deleteRecipe } from '../delete-recipe'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockFindOneAndDelete = RecipeModel.findOneAndDelete as jest.Mock

const recipeId = '507f1f77bcf86cd799439011'

describe('deleteRecipe', () => {
    beforeEach(() => jest.clearAllMocks())

    it('throws when unauthenticated', async () => {
        mockAuth.mockResolvedValue({ userId: null } as never)
        await expect(deleteRecipe(recipeId)).rejects.toThrow()
        expect(mockFindOneAndDelete).not.toHaveBeenCalled()
    })

    it('deletes the recipe scoped to the current user', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)
        mockFindOneAndDelete.mockReturnValue({
            lean: jest.fn().mockResolvedValue({ _id: { toString: () => recipeId } })
        })

        await deleteRecipe(recipeId)

        expect(mockFindOneAndDelete).toHaveBeenCalledWith({ _id: recipeId, userId: 'user_123' })
    })

    it('throws when the recipe does not exist for this user', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)
        mockFindOneAndDelete.mockReturnValue({
            lean: jest.fn().mockResolvedValue(null)
        })

        await expect(deleteRecipe(recipeId)).rejects.toThrow()
    })

    it('throws without querying when the id is not a valid ObjectId', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)

        await expect(deleteRecipe('not-an-id')).rejects.toThrow()
        expect(mockFindOneAndDelete).not.toHaveBeenCalled()
    })
})
