/**
 * @jest-environment node
 */
jest.mock('@/lib/auth', () => ({
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

import { auth } from '@/lib/auth'

import { RecipeModel } from '@/models/recipe.model'

import { getCookingHistory } from '../get-cooking-history'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockFind = RecipeModel.find as jest.Mock

const chain = (result: unknown) => ({
    lean: jest.fn().mockResolvedValue(result)
})

describe('getCookingHistory', () => {
    beforeEach(() => jest.clearAllMocks())

    it('returns an empty array when unauthenticated', async () => {
        mockAuth.mockResolvedValue(null as never)

        const result = await getCookingHistory()

        expect(result).toEqual([])
        expect(mockFind).not.toHaveBeenCalled()
    })

    it('queries only recipes with a non-empty history', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockFind.mockReturnValue(chain([]))

        await getCookingHistory()

        expect(mockFind).toHaveBeenCalledWith({
            userId: 'user_123',
            'history.0': { $exists: true }
        })
    })

    it('returns an empty array when the user has no cooked recipes', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockFind.mockReturnValue(chain([]))

        const result = await getCookingHistory()

        expect(result).toEqual([])
    })

    it('sorts recipes by their most recent history entry, descending', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockFind.mockReturnValue(chain([
            {
                _id: { toString: () => 'older' },
                userId: 'user_123',
                history: [
                    {
                        entryId: 'e1',
                        cookedAt: new Date('2026-01-01'),
                        rating: 4
                    }
                ]
            },
            {
                _id: { toString: () => 'newer' },
                userId: 'user_123',
                history: [
                    {
                        entryId: 'e2',
                        cookedAt: new Date('2026-01-10'),
                        rating: 5
                    },
                    {
                        entryId: 'e3',
                        cookedAt: new Date('2026-01-05'),
                        rating: null
                    }
                ]
            }
        ]))

        const result = await getCookingHistory()

        expect(result.map((recipe) => recipe._id)).toEqual([
            'newer',
            'older'
        ])
    })
})
