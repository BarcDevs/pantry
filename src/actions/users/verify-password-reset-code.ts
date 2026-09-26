'use server'

import { isResetCodeValid } from '@/lib/auth/verify-reset-code'
import connectDB from '@/lib/mongodb'

import { UserModel } from '@/models/user.model'

type VerifyPasswordResetCodeInput = {
    email: string
    code: string
}

type VerifyPasswordResetCodeResult = {
    success: boolean
    error?: 'invalid-code'
}

export const verifyPasswordResetCode = async (
    input: VerifyPasswordResetCodeInput
): Promise<VerifyPasswordResetCodeResult> => {
    await connectDB()

    const user = await UserModel.findOne({ email: input.email })
    if (!user || !(await isResetCodeValid(user, input.code))) {
        return { success: false, error: 'invalid-code' }
    }

    return { success: true }
}
