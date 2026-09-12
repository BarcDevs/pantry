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
jest.mock('@/models/user.model', () => ({
    UserModel: {
        findByIdAndUpdate: jest.fn()
    }
}))

import { auth } from '@/lib/auth'

import { UserModel } from '@/models/user.model'

import { updateOnboarding } from '../update-onboarding'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockFindByIdAndUpdate = UserModel.findByIdAndUpdate as jest.Mock

describe('updateOnboarding', () => {
    beforeEach(() => jest.clearAllMocks())

    it('throws when unauthenticated', async () => {
        mockAuth.mockResolvedValue(null as never)
        await expect(updateOnboarding({})).rejects.toThrow()
        expect(mockFindByIdAndUpdate).not.toHaveBeenCalled()
    })

    it('sets onboardingCompletedAt even when all steps skipped', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockFindByIdAndUpdate.mockReturnValue({
            lean: jest.fn().mockResolvedValue({
                _id: { toString: () => 'obj_1' },
                email: 'a@b.com'
            })
        })

        await updateOnboarding({})

        expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
            'user_123',
            expect.objectContaining({
                onboardingCompletedAt: expect.any(Date)
            }),
            { returnDocument: 'after', runValidators: true }
        )
    })

    it('persists filled-in step values along with completion timestamp', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockFindByIdAndUpdate.mockReturnValue({
            lean: jest.fn().mockResolvedValue({ _id: { toString: () => 'obj_1' }, email: 'a@b.com' })
        })

        await updateOnboarding({
            cookingLevel: 'easy',
            householdSize: 2,
            dietaryPreferences: ['vegan']
        })

        expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
            'user_123',
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
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)

        await expect(updateOnboarding({
            cookingLevel: 'expert' as never
        })).rejects.toThrow()
        expect(mockFindByIdAndUpdate).not.toHaveBeenCalled()
    })
})
