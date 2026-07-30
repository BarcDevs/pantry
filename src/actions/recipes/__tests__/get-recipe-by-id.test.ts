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
        findOne: jest.fn()
    }
}))

import { auth } from '@clerk/nextjs/server'

import { RecipeModel } from '@/models/recipe.model'

import { getRecipeById } from '../get-recipe-by-id'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockFindOne = RecipeModel.findOne as jest.Mock

const leanChain = (result: unknown) => ({
    lean: jest.fn().mockResolvedValue(result)
})

const recipeId = '507f1f77bcf86cd799439011'

describe('getRecipeById', () => {
    beforeEach(() => jest.clearAllMocks())

    it('returns null when unauthenticated', async () => {
        mockAuth.mockResolvedValue({ userId: null } as never)
        expect(await getRecipeById(recipeId)).toBeNull()
        expect(mockFindOne).not.toHaveBeenCalled()
    })

    it('returns null for an invalid id', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)
        expect(await getRecipeById('not-an-id')).toBeNull()
        expect(mockFindOne).not.toHaveBeenCalled()
    })

    it('returns the recipe scoped to the current user', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)
        mockFindOne.mockReturnValue(leanChain({
            _id: { toString: () => recipeId },
            title: 'פסטה'
        }))

        const result = await getRecipeById(recipeId)

        expect(result).toEqual({ _id: recipeId, title: 'פסטה' })
        expect(mockFindOne).toHaveBeenCalledWith({
            _id: recipeId,
            userId: 'user_123'
        })
    })

    it('returns null when not found or not owned', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)
        mockFindOne.mockReturnValue(leanChain(null))

        expect(await getRecipeById(recipeId)).toBeNull()
    })
})
