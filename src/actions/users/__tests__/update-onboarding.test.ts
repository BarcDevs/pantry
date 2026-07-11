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

import { updateOnboarding } from '../update-onboarding'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockFindOneAndUpdate = UserModel.findOneAndUpdate as jest.Mock

describe('updateOnboarding', () => {
    beforeEach(() => jest.clearAllMocks())

    it('throws when unauthenticated', async () => {
        mockAuth.mockResolvedValue({ userId: null } as never)
        await expect(updateOnboarding({})).rejects.toThrow()
        expect(mockFindOneAndUpdate).not.toHaveBeenCalled()
    })

    it('sets onboardingCompletedAt even when all steps skipped', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)
        mockFindOneAndUpdate.mockReturnValue({
            lean: jest.fn().mockResolvedValue({
                _id: { toString: () => 'obj_1' },
                clerkId: 'user_123'
            })
        })

        await updateOnboarding({})

        expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
            { clerkId: 'user_123' },
            expect.objectContaining({
                onboardingCompletedAt: expect.any(Date)
            }),
            { returnDocument: 'after', runValidators: true }
        )
    })

    it('persists filled-in step values along with completion timestamp', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)
        mockFindOneAndUpdate.mockReturnValue({
            lean: jest.fn().mockResolvedValue({ _id: { toString: () => 'obj_1' }, clerkId: 'user_123' })
        })

        await updateOnboarding({
            cookingLevel: 'easy',
            householdSize: 2,
            dietaryPreferences: ['vegan']
        })

        expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
            { clerkId: 'user_123' },
            expect.objectContaining({
                cookingLevel: 'easy',
                householdSize: 2,
                dietaryPreferences: ['vegan'],
                onboardingCompletedAt: expect.any(Date)
            }),
            { returnDocument: 'after', runValidators: true }
        )
    })

    it('rejects an invalid cookingLevel without hitting the DB', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)

        await expect(updateOnboarding({
            cookingLevel: 'expert' as never
        })).rejects.toThrow()
        expect(mockFindOneAndUpdate).not.toHaveBeenCalled()
    })
})
