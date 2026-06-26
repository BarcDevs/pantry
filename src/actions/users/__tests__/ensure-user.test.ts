/**
 * @jest-environment node
 */
jest.mock('@clerk/nextjs/server', () => ({
    auth: jest.fn(),
    clerkClient: jest.fn()
}))
jest.mock('@/lib/mongodb', () => ({
    __esModule: true,
    default: jest.fn()
}))
jest.mock('@/models/user.model', () => ({
    UserModel: {
        findOne: jest.fn(),
        create: jest.fn()
    }
}))

import { auth, clerkClient } from '@clerk/nextjs/server'

import { UserModel } from '@/models/user.model'

import { ensureUser } from '../ensure-user'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockClerkClient = clerkClient as jest.MockedFunction<
    typeof clerkClient
>
const mockFindOne = UserModel.findOne as jest.Mock
const mockCreate = UserModel.create as jest.Mock

describe('ensureUser', () => {
    beforeEach(() => jest.clearAllMocks())

    it('returns null when unauthenticated', async () => {
        mockAuth.mockResolvedValue({
            userId: null
        } as never)
        expect(await ensureUser()).toBeNull()
        expect(mockFindOne).not.toHaveBeenCalled()
    })

    it('returns existing user without hitting Clerk API', async () => {
        const user = {
            clerkId: 'user_123',
            email: 'a@b.com',
            displayName: 'Test'
        }
        mockAuth.mockResolvedValue({
            userId: 'user_123'
        } as never)
        mockFindOne.mockReturnValue({
            lean: jest.fn().mockResolvedValue(user)
        })

        expect(await ensureUser()).toEqual(user)
        expect(mockClerkClient).not.toHaveBeenCalled()
    })

    it('creates user from Clerk when not found', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_456' } as never)
        mockFindOne.mockReturnValue({
            lean: jest.fn().mockResolvedValue(null)
        })
        mockClerkClient.mockResolvedValue({
            users: {
                getUser: jest.fn().mockResolvedValue({
                    emailAddresses: [{
                        emailAddress: 'new@example.com'
                    }],
                    firstName: 'Noa',
                    lastName: 'Levi'
                })
            }
        } as never)
        const created = {
            clerkId: 'user_456',
            email: 'new@example.com',
            displayName: 'Noa Levi'
        }
        mockCreate.mockResolvedValue({
            ...created,
            toObject: jest.fn().mockReturnValue(created)
        })

        expect(await ensureUser()).toEqual(created)
        expect(mockCreate).toHaveBeenCalledWith(
            expect.objectContaining({
                clerkId: 'user_456',
                email: 'new@example.com',
                displayName: 'Noa Levi',
                onboardingCompletedAt: null
            })
        )
    })
})
