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
        findOne: jest.fn(),
        findOneAndUpdate: jest.fn()
    }
}))

import { auth } from '@clerk/nextjs/server'

import { RecipeModel }
    from '@/models/recipe.model'

import { updateHistoryEntryRating }
    from '../update-history-entry-rating'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockFindOne = RecipeModel.findOne as jest.Mock
const mockFindOneAndUpdate = (
    RecipeModel.findOneAndUpdate as jest.Mock
)

const leanChain = (result: unknown) => ({
    lean: jest.fn().mockResolvedValue(result)
})

const recipeId = '507f1f77bcf86cd799439011'

describe('updateHistoryEntryRating', () => {
    beforeEach(() => jest.clearAllMocks())

    it('throws when unauthenticated', async () => {
        mockAuth.mockResolvedValue({ userId: null } as never)
        await expect(
            updateHistoryEntryRating(recipeId, 'e1', 5)
        ).rejects.toThrow()
        expect(mockFindOneAndUpdate).not.toHaveBeenCalled()
    })

    it('throws when the recipe is not found or not owned', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)
        mockFindOne.mockReturnValue(leanChain(null))

        await expect(
            updateHistoryEntryRating(recipeId, 'e1', 5)
        ).rejects.toThrow()
    })

    it('throws when the history entry does not exist', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)
        mockFindOne.mockReturnValue(leanChain({
            _id: { toString: () => recipeId },
            userId: 'user_123',
            history: [
                { entryId: 'e1', cookedAt: new Date(), rating: 4 }
            ]
        }))

        await expect(
            updateHistoryEntryRating(recipeId, 'missing', 5)
        ).rejects.toThrow()
        expect(mockFindOneAndUpdate).not.toHaveBeenCalled()
    })

    it('sets a rating on a previously-skipped entry and recomputes the average', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)
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
            rating: 3,
            history: []
        }))

        await updateHistoryEntryRating(recipeId, 'e2', 2)

        expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
            { _id: recipeId, userId: 'user_123' },
            expect.objectContaining({
                rating: 3,
                history: expect.arrayContaining([
                    expect.objectContaining({ entryId: 'e1', rating: 4 }),
                    expect.objectContaining({ entryId: 'e2', rating: 2 })
                ])
            }),
            expect.objectContaining({ returnDocument: 'after' })
        )
    })

    it('changes an existing rating and recomputes the average', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)
        mockFindOne.mockReturnValue(leanChain({
            _id: { toString: () => recipeId },
            userId: 'user_123',
            history: [
                { entryId: 'e1', cookedAt: new Date(), rating: 4 }
            ]
        }))
        mockFindOneAndUpdate.mockReturnValue(leanChain({
            _id: { toString: () => recipeId },
            rating: 2,
            history: []
        }))

        await updateHistoryEntryRating(recipeId, 'e1', 2)

        expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
            { _id: recipeId, userId: 'user_123' },
            expect.objectContaining({
                rating: 2,
                history: expect.arrayContaining([
                    expect.objectContaining({ entryId: 'e1', rating: 2 })
                ])
            }),
            expect.anything()
        )
    })
})
