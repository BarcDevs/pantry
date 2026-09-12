'use server'

import bcrypt from 'bcryptjs'

import connectDB from '@/lib/mongodb'

import { UserModel } from '@/models/user.model'

type SignUpInput = {
    fullName: string
    email: string
    password: string
}

type SignUpResult = {
    success: boolean
    error?: string
}

export const signUp = async (input: SignUpInput): Promise<SignUpResult> => {
    await connectDB()

    const existing = await UserModel.findOne({ email: input.email })
    if (existing) {
        return { success: false, error: 'email-taken' }
    }

    const passwordHash = await bcrypt.hash(input.password, 10)

    await UserModel.create({
        email: input.email,
        displayName: input.fullName,
        passwordHash,
        emailVerifiedAt: new Date(),
        dietaryPreferences: [],
        onboardingCompletedAt: null
    })

    return { success: true }
}
