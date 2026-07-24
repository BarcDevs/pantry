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
jest.mock('@/models/user.model', () => ({
    UserModel: {
        findOneAndUpdate: jest.fn()
    }
}))

import { auth } from '@clerk/nextjs/server'

import { UserModel } from '@/models/user.model'

import { updateUserProfile } from '../update-user-profile'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockFindOneAndUpdate = UserModel.findOneAndUpdate as jest.Mock

describe('updateUserProfile', () => {
    beforeEach(() => jest.clearAllMocks())

    it('throws when unauthenticated', async () => {
        mockAuth.mockResolvedValue({ userId: null } as never)
        await expect(updateUserProfile({ displayName: 'שם' })).rejects.toThrow()
        expect(mockFindOneAndUpdate).not.toHaveBeenCalled()
    })

    it('updates the profile scoped to the current user', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)
        mockFindOneAndUpdate.mockReturnValue({
            lean: jest.fn().mockResolvedValue({
                _id: { toString: () => 'obj_1' },
                clerkId: 'user_123',
                displayName: 'שם חדש',
                cookingLevel: 'medium',
                householdSize: 3,
                dietaryPreferences: ['vegan']
            })
        })

        const result = await updateUserProfile({
            displayName: 'שם חדש',
            cookingLevel: 'medium',
            householdSize: 3,
            dietaryPreferences: ['vegan']
        })

        expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
            { clerkId: 'user_123' },
            expect.objectContaining({
                displayName: 'שם חדש',
                cookingLevel: 'medium',
                householdSize: 3,
                dietaryPreferences: ['vegan']
            }),
            { returnDocument: 'after', runValidators: true }
        )
        expect(result).toEqual(expect.objectContaining({ _id: 'obj_1', displayName: 'שם חדש' }))
    })

    it('rejects an invalid cookingLevel without hitting the DB', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)

        await expect(updateUserProfile({
            cookingLevel: 'expert' as never
        })).rejects.toThrow()
        expect(mockFindOneAndUpdate).not.toHaveBeenCalled()
    })

    it('throws when the user is not found', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)
        mockFindOneAndUpdate.mockReturnValue({
            lean: jest.fn().mockResolvedValue(null)
        })

        await expect(updateUserProfile({ displayName: 'שם' })).rejects.toThrow()
    })
})
