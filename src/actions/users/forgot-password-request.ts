'use server'

import {
    generateVerificationCode,
    verificationCodeTtlMs
} from '@/lib/auth/generate-code'
import connectDB from '@/lib/mongodb'

import { UserModel } from '@/models/user.model'

type ForgotPasswordResult = {
    success: boolean
    devCode?: string
}

export const forgotPasswordRequest = async (
    email: string
): Promise<ForgotPasswordResult> => {
    await connectDB()

    const user = await UserModel.findOne({ email })
    if (!user) return { success: true }

    const verificationCode = generateVerificationCode()
    user.verificationCode = verificationCode
    user.verificationCodeExpiresAt = new Date(Date.now() + verificationCodeTtlMs)
    await user.save()

    return { success: true, devCode: verificationCode }
}
