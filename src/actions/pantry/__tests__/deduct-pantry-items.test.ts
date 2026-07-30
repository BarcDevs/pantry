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
        findOneAndUpdate: jest.fn(),
        findOneAndDelete: jest.fn()
    }
}))

import { auth } from '@clerk/nextjs/server'

import { PantryItemModel } from '@/models/pantry-item.model'

import { deductPantryItems } from '../deduct-pantry-items'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockFindOneAndUpdate = PantryItemModel.findOneAndUpdate as jest.Mock
const mockFindOneAndDelete = PantryItemModel.findOneAndDelete as jest.Mock

const itemId1 = '507f1f77bcf86cd799439011'
const itemId2 = '507f1f77bcf86cd799439012'

describe('deductPantryItems', () => {
    beforeEach(() => jest.clearAllMocks())

    it('throws when unauthenticated', async () => {
        mockAuth.mockResolvedValue({ userId: null } as never)
        await expect(deductPantryItems([{ id: itemId1, newQuantity: 1 }])).rejects.toThrow()
        expect(mockFindOneAndUpdate).not.toHaveBeenCalled()
    })

    it('updates quantity scoped to the current user for kept edits', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)
        mockFindOneAndUpdate.mockReturnValue({ lean: jest.fn().mockResolvedValue({}) })

        await deductPantryItems([{ id: itemId1, newQuantity: 2 }])

        expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
            { _id: itemId1, userId: 'user_123' },
            { quantity: 2 },
            { runValidators: true }
        )
        expect(mockFindOneAndDelete).not.toHaveBeenCalled()
    })

    it('deletes the item scoped to the current user when remove is true', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)
        mockFindOneAndDelete.mockReturnValue({ lean: jest.fn().mockResolvedValue({}) })

        await deductPantryItems([{
            id: itemId2,
            newQuantity: 0,
            remove: true
        }])

        expect(mockFindOneAndDelete).toHaveBeenCalledWith({ _id: itemId2, userId: 'user_123' })
        expect(mockFindOneAndUpdate).not.toHaveBeenCalled()
    })

    it('allows quantity 0 for kept-at-zero edits', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)
        mockFindOneAndUpdate.mockReturnValue({ lean: jest.fn().mockResolvedValue({}) })

        await deductPantryItems([{ id: itemId1, newQuantity: 0 }])

        expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
            { _id: itemId1, userId: 'user_123' },
            { quantity: 0 },
            { runValidators: true }
        )
    })

    it('rejects negative quantities', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)
        await expect(deductPantryItems([{ id: itemId1, newQuantity: -1 }])).rejects.toThrow()
        expect(mockFindOneAndUpdate).not.toHaveBeenCalled()
    })

    it('rejects invalid ids without querying', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)
        await expect(deductPantryItems([{ id: 'not-an-id', newQuantity: 1 }])).rejects.toThrow()
        expect(mockFindOneAndUpdate).not.toHaveBeenCalled()
    })
})
