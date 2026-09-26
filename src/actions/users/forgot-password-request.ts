'use server'

import bcrypt from 'bcryptjs'

import {
    generateVerificationCode,
    verificationCodeTtlMs
} from '@/lib/auth/generate-code'
import { sendPasswordResetEmail } from '@/lib/email/send-password-reset-email'
import connectDB from '@/lib/mongodb'

import { minuteInMs } from '@/constants/time'

import env from '@/config/env'

import { UserModel } from '@/models/user.model'

type ForgotPasswordRequestResult = {
    success: true
    devCode?: string
}

export const forgotPasswordRequest = async (
    email: string
): Promise<ForgotPasswordRequestResult> => {
    await connectDB()

    const user = await UserModel.findOne({ email })
    if (!user) return { success: true }

    const code = generateVerificationCode()
    user.resetCodeHash = await bcrypt.hash(code, 10)
    user.resetCodeExpiresAt = new Date(Date.now() + verificationCodeTtlMs)
    await user.save()

    await sendPasswordResetEmail({
        email,
        code,
        expiresMinutes: verificationCodeTtlMs / minuteInMs
    })

    return {
        success: true,
        devCode: env.e2eMockEmail ? code : undefined
    }
}
