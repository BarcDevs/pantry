'use server'

import bcrypt from 'bcryptjs'

import connectDB from '@/lib/mongodb'

import { UserModel } from '@/models/user.model'

type ForgotPasswordResetInput = {
    email: string
    code: string
    password: string
}

export const forgotPasswordReset = async (
    input: ForgotPasswordResetInput
): Promise<boolean> => {
    await connectDB()

    const user = await UserModel.findOne({ email: input.email })
    if (!user || !user.verificationCode || !user.verificationCodeExpiresAt) return false
    if (user.verificationCode !== input.code) return false
    if (user.verificationCodeExpiresAt.getTime() < Date.now()) return false

    user.passwordHash = await bcrypt.hash(input.password, 10)
    user.verificationCode = null
    user.verificationCodeExpiresAt = null
    await user.save()

    return true
}
