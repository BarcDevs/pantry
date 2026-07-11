'use server'

import { z } from 'zod'

import { auth } from '@clerk/nextjs/server'

import { DIFFICULTIES } from '@/types/enums'
import type { OnboardingInput, User } from '@/types/user'

import { toPlainDoc } from '@/lib/mongo-doc'
import connectDB from '@/lib/mongodb'

import { MAX_HOUSEHOLD_SIZE, MIN_HOUSEHOLD_SIZE } from '@/constants/onboarding'

import { UserModel } from '@/models/user.model'

const onboardingInputSchema = z.object({
    cookingLevel: z.enum(DIFFICULTIES).optional(),
    householdSize: z.number().int()
        .min(MIN_HOUSEHOLD_SIZE).max(MAX_HOUSEHOLD_SIZE).optional(),
    dietaryPreferences: z.array(
        z.string().min(1).max(50)
    ).max(10).optional()
})

export const updateOnboarding = async (
    input: OnboardingInput
): Promise<User | null> => {
    const { userId: clerkId } = await auth()
    if (!clerkId) throw new Error('Unauthenticated')

    const parsedInput = onboardingInputSchema.parse(input)

    await connectDB()

    const updated = await UserModel.findOneAndUpdate(
        { clerkId },
        { ...parsedInput, onboardingCompletedAt: new Date() },
        { returnDocument: 'after', runValidators: true }
    ).lean()

    if (!updated) return null
    return toPlainDoc<User>(updated)
}
