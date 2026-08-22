'use server'

import { auth } from '@clerk/nextjs/server'

import type { OnboardingInput, User } from '@/types/user'

import { toPlainDoc } from '@/lib/mongo-doc'
import connectDB from '@/lib/mongodb'

import { ensureUser } from '@/actions/users/ensure-user'
import { UserModel } from '@/models/user.model'
import { userProfileFieldsSchema } from '@/schemas/user-profile'

const onboardingInputSchema = userProfileFieldsSchema

export const updateOnboarding = async (
    input: OnboardingInput
): Promise<User | null> => {
    const { userId: clerkId } = await auth()
    if (!clerkId) throw new Error('Unauthenticated')

    const parsedInput = onboardingInputSchema.parse(input)

    await connectDB()
    const ensured = await ensureUser()
    if (!ensured) {
        throw new Error(
            'Failed to ensure user record before onboarding update'
        )
    }

    const updated = await UserModel.findOneAndUpdate(
        { clerkId },
        { ...parsedInput, onboardingCompletedAt: new Date() },
        { returnDocument: 'after', runValidators: true }
    ).lean()

    if (!updated) return null
    return toPlainDoc<User>(updated)
}
