/**
 * @jest-environment node
 */
const mockVerify = jest.fn()

jest.mock('svix', () => ({
    Webhook: jest.fn().mockImplementation(
        () => ({ verify: mockVerify })
    )
}))
jest.mock('next/headers', () => ({
    headers: jest.fn()
}))
jest.mock('@/lib/mongodb', () => ({
    __esModule: true,
    default: jest.fn()
}))
jest.mock('@/models/user.model', () => ({
    UserModel: {
        findOneAndUpdate: jest.fn(),
        deleteOne: jest.fn()
    }
}))
jest.mock('@/config/env', () => ({
    default: { clerkWebhookSecret: 'test_secret' }
}))

import { headers } from 'next/headers'

import { HttpStatusCodes } from '@/constants/httpStatusCodes'

import { UserModel } from '@/models/user.model'

import { POST } from '../route'

const mockHeaders = headers as jest.MockedFunction<
    typeof headers
>
const mockFindOneAndUpdate
    = UserModel.findOneAndUpdate as jest.Mock
const mockDeleteOne = UserModel.deleteOne as jest.Mock

const defaults: Record<string, string> = {
    'svix-id': 'test-id',
    'svix-timestamp': '123456',
    'svix-signature': 'v1,abc123'
}

const makeHeadersMap = (
    overrides: Record<string, string | null> = {}
) => ({
    get: jest.fn(
        (key: string) =>
            key in overrides
                ? overrides[key]
                : defaults[key] ?? null
    )
})

const makeRequest = (body: object) =>
    new Request('http://localhost/api/users/sync', {
        method: 'POST',
        body: JSON.stringify(body)
    })

describe('POST /api/users/sync', () => {
    beforeEach(() => jest.clearAllMocks())

    it('returns 400 when svix headers are missing', async () => {
        mockHeaders.mockResolvedValue(
            makeHeadersMap({ 'svix-id': null }) as never
        )
        const res = await POST(makeRequest({}))
        expect(res.status).toBe(HttpStatusCodes.BAD_REQUEST)
    })

    it('returns 401 when signature is invalid', async () => {
        mockHeaders.mockResolvedValue(
            makeHeadersMap() as never
        )
        mockVerify.mockImplementation(() => {
            throw new Error('Invalid')
        })
        const res = await POST(makeRequest({}))
        expect(res.status).toBe(HttpStatusCodes.UNAUTHORIZED)
    })

    it('upserts user on user.created', async () => {
        mockHeaders.mockResolvedValue(
            makeHeadersMap() as never
        )
        const event = {
            type: 'user.created',
            data: {
                id: 'clerk_789',
                email_addresses: [{
                    email_address: 'test@example.com'
                }],
                first_name: 'Test',
                last_name: 'User'
            }
        }
        mockVerify.mockReturnValue(event)
        mockFindOneAndUpdate.mockResolvedValue({})

        const res = await POST(makeRequest(event))
        expect(res.status).toBe(HttpStatusCodes.OK)
        expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
            { clerkId: 'clerk_789' },
            { $set: {
                email: 'test@example.com',
                displayName: 'Test User'
            } },
            { upsert: true }
        )
    })

    it('is idempotent - same clerkId upserts twice', async () => {
        mockHeaders.mockResolvedValue(
            makeHeadersMap() as never
        )
        const event = {
            type: 'user.created',
            data: {
                id: 'clerk_dup',
                email_addresses: [{
                    email_address: 'a@b.com'
                }],
                first_name: 'A',
                last_name: 'B'
            }
        }
        mockVerify.mockReturnValue(event)
        mockFindOneAndUpdate.mockResolvedValue({})

        const [r1, r2] = await Promise.all([
            POST(makeRequest(event)),
            POST(makeRequest(event))
        ])
        expect(r1.status).toBe(200)
        expect(r2.status).toBe(200)
        expect(mockFindOneAndUpdate).toHaveBeenCalledTimes(2)
    })

    it('deletes user on user.deleted', async () => {
        mockHeaders.mockResolvedValue(
            makeHeadersMap() as never
        )
        const event = {
            type: 'user.deleted',
            data: { id: 'clerk_del' }
        }
        mockVerify.mockReturnValue(event)
        mockDeleteOne.mockResolvedValue({})

        const res = await POST(makeRequest(event))
        expect(res.status).toBe(HttpStatusCodes.OK)
        expect(mockDeleteOne).toHaveBeenCalledWith(
            { clerkId: 'clerk_del' }
        )
    })
})
