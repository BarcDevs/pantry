'use server'

import bcrypt from 'bcryptjs'

import connectDB from '@/lib/mongodb'

import { UserModel } from '@/models/user.model'

type ForgotPasswordResetInput = {
    email: string
    password: string
}

// TODO before publish: no email verification of ownership - anyone who knows an
// account's email can reset its password. Needs a real emailed code/link once
// an email provider is wired up (single-user MVP, no provider set up yet).
export const forgotPasswordReset = async (
    input: ForgotPasswordResetInput
): Promise<boolean> => {
    await connectDB()

    const user = await UserModel.findOne({ email: input.email })
    if (!user) return false

    user.passwordHash = await bcrypt.hash(input.password, 10)
    await user.save()

    return true
}
