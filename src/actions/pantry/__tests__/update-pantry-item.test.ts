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
jest.mock('@/models/pantry-item.model', () => ({
    PantryItemModel: {
        findOneAndUpdate: jest.fn()
    }
}))

import { auth } from '@clerk/nextjs/server'

import { PantryItemModel } from '@/models/pantry-item.model'

import { updatePantryItem } from '../update-pantry-item'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockFindOneAndUpdate = PantryItemModel.findOneAndUpdate as jest.Mock

const itemId = '507f1f77bcf86cd799439011'

describe('updatePantryItem', () => {
    beforeEach(() => jest.clearAllMocks())

    it('throws when unauthenticated', async () => {
        mockAuth.mockResolvedValue({ userId: null } as never)
        await expect(updatePantryItem(itemId, { quantity: 2 })).rejects.toThrow()
        expect(mockFindOneAndUpdate).not.toHaveBeenCalled()
    })

    it('updates the item scoped to the current user and returns the plain doc', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)
        mockFindOneAndUpdate.mockReturnValue({
            lean: jest.fn().mockResolvedValue({
                _id: { toString: () => itemId },
                name: 'עגבניות',
                quantity: 3,
                userId: 'user_123'
            })
        })

        const result = await updatePantryItem(itemId, { quantity: 3 })

        expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
            { _id: itemId, userId: 'user_123' },
            expect.objectContaining({ quantity: 3 }),
            { returnDocument: 'after', runValidators: true }
        )
        expect(result).toEqual(expect.objectContaining({ _id: itemId, quantity: 3 }))
    })

    it('throws when the item does not exist for this user', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)
        mockFindOneAndUpdate.mockReturnValue({
            lean: jest.fn().mockResolvedValue(null)
        })

        await expect(updatePantryItem(itemId, { quantity: 1 })).rejects.toThrow()
    })

    it('throws without querying when the id is not a valid ObjectId', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)

        await expect(updatePantryItem('not-an-id', { quantity: 1 })).rejects.toThrow()
        expect(mockFindOneAndUpdate).not.toHaveBeenCalled()
    })
})
