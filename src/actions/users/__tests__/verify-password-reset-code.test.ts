/**
 * @jest-environment node
 */
jest.mock('@/models/user.model', () => ({
    UserModel: {
        findOne: jest.fn()
    }
}))

import bcrypt from 'bcryptjs'

import { UserModel } from '@/models/user.model'

import { verifyPasswordResetCode } from '../verify-password-reset-code'

const mockFindOne = UserModel.findOne as jest.Mock

describe('verifyPasswordResetCode', () => {
    beforeEach(() => jest.clearAllMocks())

    it('rejects when the user does not exist', async () => {
        mockFindOne.mockResolvedValue(null)

        const result = await verifyPasswordResetCode({ email: 'ghost@example.com', code: '123456' })

        expect(result).toEqual({ success: false, error: 'invalid-code' })
    })

    it('rejects an expired code', async () => {
        mockFindOne.mockResolvedValue({
            resetCodeHash: await bcrypt.hash('123456', 10),
            resetCodeExpiresAt: new Date(Date.now() - 1000)
        })

        const result = await verifyPasswordResetCode({ email: 'a@b.com', code: '123456' })

        expect(result).toEqual({ success: false, error: 'invalid-code' })
    })

    it('rejects a mismatched code', async () => {
        mockFindOne.mockResolvedValue({
            resetCodeHash: await bcrypt.hash('123456', 10),
            resetCodeExpiresAt: new Date(Date.now() + 60000)
        })

        const result = await verifyPasswordResetCode({ email: 'a@b.com', code: '000000' })

        expect(result).toEqual({ success: false, error: 'invalid-code' })
    })

    it('accepts a valid, unexpired code', async () => {
        mockFindOne.mockResolvedValue({
            resetCodeHash: await bcrypt.hash('123456', 10),
            resetCodeExpiresAt: new Date(Date.now() + 60000)
        })

        const result = await verifyPasswordResetCode({ email: 'a@b.com', code: '123456' })

        expect(result).toEqual({ success: true })
    })
})
