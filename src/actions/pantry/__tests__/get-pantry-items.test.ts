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
        find: jest.fn()
    }
}))

import { auth } from '@clerk/nextjs/server'

import { PantryItemModel } from '@/models/pantry-item.model'

import { getPantryItems } from '../get-pantry-items'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockFind = PantryItemModel.find as jest.Mock

const chain = (result: unknown) => ({
    sort: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(result)
    })
})

describe('getPantryItems', () => {
    beforeEach(() => jest.clearAllMocks())

    it('returns empty array when unauthenticated', async () => {
        mockAuth.mockResolvedValue({ userId: null } as never)
        expect(await getPantryItems()).toEqual([])
        expect(mockFind).not.toHaveBeenCalled()
    })

    it('queries items scoped to the current user, sorted by expiry asc with nulls last', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)
        const items = [{ name: 'a' }]
        mockFind.mockReturnValue(chain(items))

        expect(await getPantryItems()).toEqual(items)
        expect(mockFind).toHaveBeenCalledWith({ userId: 'user_123' })
        const sortCall = mockFind.mock.results[0].value.sort
        expect(sortCall).toHaveBeenCalledWith({ expiryDate: 1 })
    })

    it('filters by expiringWithinDays when provided', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)
        mockFind.mockReturnValue(chain([]))

        await getPantryItems({ expiringWithinDays: 7 })

        expect(mockFind).toHaveBeenCalledWith(
            expect.objectContaining({
                userId: 'user_123',
                expiryDate: expect.objectContaining({
                    $lte: expect.any(Date)
                })
            })
        )
    })
})
