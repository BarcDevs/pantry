/**
 * @jest-environment node
 */
jest.mock('@/models/user.model', () => ({
    UserModel: {
        findById: jest.fn()
    }
}))

import { auth } from '@/lib/auth'

import { UserModel } from '@/models/user.model'

import { ensureUser } from '../ensure-user'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockFindById = UserModel.findById as jest.Mock

describe('ensureUser', () => {
    beforeEach(() => jest.clearAllMocks())

    it('returns null when unauthenticated', async () => {
        mockAuth.mockResolvedValue(null as never)
        expect(await ensureUser()).toBeNull()
        expect(mockFindById).not.toHaveBeenCalled()
    })

    it('returns the current user record', async () => {
        const user = {
            _id: { toString: () => 'obj_123' },
            email: 'a@b.com',
            displayName: 'Test'
        }
        mockAuth.mockResolvedValue({ user: { id: 'obj_123' } } as never)
        mockFindById.mockReturnValue({
            lean: jest.fn().mockResolvedValue(user)
        })

        expect(await ensureUser()).toEqual({
            _id: 'obj_123',
            email: 'a@b.com',
            displayName: 'Test'
        })
        expect(mockFindById).toHaveBeenCalledWith('obj_123')
    })

    it('returns null when the user record is missing', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'obj_456' } } as never)
        mockFindById.mockReturnValue({
            lean: jest.fn().mockResolvedValue(null)
        })

        expect(await ensureUser()).toBeNull()
    })
})
