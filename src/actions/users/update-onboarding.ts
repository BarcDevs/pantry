'use server'

import type { OnboardingInput, User } from '@/types/user'

import { auth } from '@/lib/auth'
import { toPlainDoc } from '@/lib/mongo-doc'
import connectDB from '@/lib/mongodb'

import { UserModel } from '@/models/user.model'
import { userProfileFieldsSchema } from '@/schemas/user-profile'

const onboardingInputSchema = userProfileFieldsSchema

export const updateOnboarding = async (
    input: OnboardingInput
): Promise<User | null> => {
    const session = await auth()
    const userId = session?.user?.id
    if (!userId) throw new Error('Unauthenticated')

    const parsedInput = onboardingInputSchema.parse(input)

    await connectDB()

    const updated = await UserModel.findByIdAndUpdate(
        userId,
        { ...parsedInput, onboardingCompletedAt: new Date() },
        { returnDocument: 'after', runValidators: true }
    ).lean()

    if (!updated) return null
    return toPlainDoc<User>(updated)
}
