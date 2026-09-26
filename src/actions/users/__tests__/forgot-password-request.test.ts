/**
 * @jest-environment node
 */
jest.mock('@/models/user.model', () => ({
    UserModel: {
        findOne: jest.fn()
    }
}))

jest.mock('@/lib/email/send-password-reset-email', () => ({
    sendPasswordResetEmail: jest.fn()
}))

jest.mock('@/config/env', () => ({
    __esModule: true,
    default: { e2eMockEmail: false }
}))

import bcrypt from 'bcryptjs'

import { sendPasswordResetEmail } from '@/lib/email/send-password-reset-email'

import { UserModel } from '@/models/user.model'

import { forgotPasswordRequest } from '../forgot-password-request'

const mockFindOne = UserModel.findOne as jest.Mock
const mockSendEmail = sendPasswordResetEmail as jest.Mock

describe('forgotPasswordRequest', () => {
    beforeEach(() => jest.clearAllMocks())

    it('does not leak whether the account exists', async () => {
        mockFindOne.mockResolvedValue(null)

        const result = await forgotPasswordRequest('ghost@example.com')

        expect(result).toEqual({ success: true, devCode: undefined })
        expect(mockSendEmail).not.toHaveBeenCalled()
    })

    it('hashes and stores a code, and sends the email', async () => {
        const user = {
            email: 'a@b.com',
            resetCodeHash: null as string | null,
            resetCodeExpiresAt: null as Date | null,
            save: jest.fn().mockResolvedValue(undefined)
        }
        mockFindOne.mockResolvedValue(user)

        const result = await forgotPasswordRequest('a@b.com')

        expect(result.success).toBe(true)
        expect(user.save).toHaveBeenCalled()
        expect(user.resetCodeHash).not.toBeNull()
        expect(user.resetCodeExpiresAt).toBeInstanceOf(Date)

        const isCodeHashValid = await bcrypt.compare(
            mockSendEmail.mock.calls[0][0].code,
            user.resetCodeHash as string
        )
        expect(isCodeHashValid).toBe(true)
        expect(mockSendEmail).toHaveBeenCalledWith(
            expect.objectContaining({ email: 'a@b.com', expiresMinutes: 15 })
        )
    })
})
