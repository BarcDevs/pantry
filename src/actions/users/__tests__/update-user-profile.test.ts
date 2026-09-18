/**
 * @jest-environment node
 */
jest.mock('@/models/user.model', () => ({
    UserModel: {
        findByIdAndUpdate: jest.fn()
    }
}))

import { auth } from '@/lib/auth'

import { UserModel } from '@/models/user.model'

import { updateUserProfile } from '../update-user-profile'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockFindByIdAndUpdate = UserModel.findByIdAndUpdate as jest.Mock

describe('updateUserProfile', () => {
    beforeEach(() => jest.clearAllMocks())

    it('throws when unauthenticated', async () => {
        mockAuth.mockResolvedValue(null as never)
        await expect(updateUserProfile({ displayName: 'שם' })).rejects.toThrow()
        expect(mockFindByIdAndUpdate).not.toHaveBeenCalled()
    })

    it('updates the profile scoped to the current user', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockFindByIdAndUpdate.mockReturnValue({
            lean: jest.fn().mockResolvedValue({
                _id: { toString: () => 'obj_1' },
                email: 'a@b.com',
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

        expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
            'user_123',
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
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)

        await expect(updateUserProfile({
            cookingLevel: 'expert' as never
        })).rejects.toThrow()
        expect(mockFindByIdAndUpdate).not.toHaveBeenCalled()
    })

    it('throws when the user is not found', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockFindByIdAndUpdate.mockReturnValue({
            lean: jest.fn().mockResolvedValue(null)
        })

        await expect(updateUserProfile({ displayName: 'שם' })).rejects.toThrow()
    })
})
