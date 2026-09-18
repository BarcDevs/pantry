/**
 * @jest-environment node
 */
jest.mock('@/models/pantry-item.model', () => ({
    PantryItemModel: {
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        findOneAndUpdate: jest.fn()
    }
}))

import type { AddPantryItemInput } from '@/types/pantry-item'

import { auth } from '@/lib/auth'

import { PantryItemModel } from '@/models/pantry-item.model'

import { addPantryItems } from '../add-pantry-items'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockFind = PantryItemModel.find as jest.Mock
const mockFindOne = PantryItemModel.findOne as jest.Mock
const mockCreate = PantryItemModel.create as jest.Mock
const mockFindOneAndUpdate = PantryItemModel.findOneAndUpdate as jest.Mock

const mockFindResult = (items: unknown[]) => ({
    select: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(items)
    })
})

const baseInput: AddPantryItemInput = {
    name: 'עגבניות',
    storage: 'fridge',
    type: 'vegetables',
    quantity: 2,
    unit: 'kg'
}

describe('addPantryItems', () => {
    beforeEach(() => jest.clearAllMocks())

    it('throws when unauthenticated', async () => {
        mockAuth.mockResolvedValue(null as never)
        await expect(addPantryItems([baseInput])).rejects.toThrow()
        expect(mockFind).not.toHaveBeenCalled()
    })

    it('creates a new item when no duplicate exists', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockFind.mockReturnValue(mockFindResult([]))
        mockCreate.mockResolvedValue({
            toObject: () => ({
                _id: { toString: () => 'obj_1' },
                ...baseInput,
                userId: 'user_123'
            })
        })

        const result = await addPantryItems([baseInput])

        expect(result).toEqual([{
            status: 'created',
            item: expect.objectContaining({ _id: 'obj_1', name: 'עגבניות' })
        }])
        expect(mockCreate).toHaveBeenCalledWith(
            expect.objectContaining({ userId: 'user_123', name: 'עגבניות' })
        )
    })

    it('returns a duplicate outcome instead of creating when normalized name matches', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockFind.mockReturnValue(mockFindResult([
            { _id: 'existing_1', name: ' עגבניות ' }
        ]))
        mockFindOne.mockReturnValue({
            lean: jest.fn().mockResolvedValue({
                _id: { toString: () => 'existing_1' },
                name: ' עגבניות ',
                userId: 'user_123'
            })
        })

        const result = await addPantryItems([baseInput])

        expect(result).toEqual([{
            status: 'duplicate',
            existing: expect.objectContaining({ _id: 'existing_1' }),
            incoming: baseInput
        }])
        expect(mockCreate).not.toHaveBeenCalled()
    })

    it('creates as a separate item when forceSeparate is set despite a name match', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockFind.mockReturnValue(mockFindResult([
            { _id: 'existing_1', name: 'עגבניות' }
        ]))
        mockCreate.mockResolvedValue({
            toObject: () => ({
                _id: { toString: () => 'obj_2' },
                ...baseInput,
                userId: 'user_123'
            })
        })

        const result = await addPantryItems([{ ...baseInput, forceSeparate: true }])

        expect(result).toEqual([{
            status: 'created',
            item: expect.objectContaining({ _id: 'obj_2' })
        }])
    })

    it('merges quantity into an existing item when mergeWithId is set', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockFind.mockReturnValue(mockFindResult([]))
        mockFindOneAndUpdate.mockReturnValue({
            lean: jest.fn().mockResolvedValue({
                _id: { toString: () => 'existing_1' },
                name: 'עגבניות',
                quantity: 4,
                userId: 'user_123'
            })
        })

        const result = await addPantryItems([{ ...baseInput, mergeWithId: 'existing_1' }])

        expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
            { _id: 'existing_1', userId: 'user_123' },
            { $inc: { quantity: baseInput.quantity } },
            { returnDocument: 'after', runValidators: true }
        )
        expect(result).toEqual([{
            status: 'created',
            item: expect.objectContaining({ _id: 'existing_1', quantity: 4 })
        }])
        expect(mockCreate).not.toHaveBeenCalled()
    })

    it('detects a duplicate against an item created earlier in the same batch', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockFind.mockReturnValue(mockFindResult([]))
        mockCreate.mockResolvedValue({
            toObject: () => ({
                _id: { toString: () => 'obj_1' },
                ...baseInput,
                userId: 'user_123'
            })
        })
        mockFindOne.mockReturnValue({
            lean: jest.fn().mockResolvedValue({
                _id: { toString: () => 'obj_1' },
                ...baseInput,
                userId: 'user_123'
            })
        })

        const result = await addPantryItems([baseInput, baseInput])

        expect(result).toEqual([
            { status: 'created', item: expect.objectContaining({ _id: 'obj_1' }) },
            {
                status: 'duplicate',
                existing: expect.objectContaining({ _id: 'obj_1' }),
                incoming: baseInput
            }
        ])
        expect(mockCreate).toHaveBeenCalledTimes(1)
    })
})
