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
jest.mock('@/models/pantry-item.model', () => ({
    PantryItemModel: {
        findOneAndDelete: jest.fn()
    }
}))

import { auth } from '@/lib/auth'

import { PantryItemModel } from '@/models/pantry-item.model'

import { deletePantryItem } from '../delete-pantry-item'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockFindOneAndDelete = PantryItemModel.findOneAndDelete as jest.Mock

const itemId = '507f1f77bcf86cd799439011'

describe('deletePantryItem', () => {
    beforeEach(() => jest.clearAllMocks())

    it('throws when unauthenticated', async () => {
        mockAuth.mockResolvedValue(null as never)
        await expect(deletePantryItem(itemId)).rejects.toThrow()
        expect(mockFindOneAndDelete).not.toHaveBeenCalled()
    })

    it('deletes the item scoped to the current user', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockFindOneAndDelete.mockReturnValue({
            lean: jest.fn().mockResolvedValue({ _id: { toString: () => itemId } })
        })

        await deletePantryItem(itemId)

        expect(mockFindOneAndDelete).toHaveBeenCalledWith({ _id: itemId, userId: 'user_123' })
    })

    it('throws when the item does not exist for this user', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockFindOneAndDelete.mockReturnValue({
            lean: jest.fn().mockResolvedValue(null)
        })

        await expect(deletePantryItem(itemId)).rejects.toThrow()
    })

    it('throws without querying when the id is not a valid ObjectId', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)

        await expect(deletePantryItem('not-an-id')).rejects.toThrow()
        expect(mockFindOneAndDelete).not.toHaveBeenCalled()
    })
})
