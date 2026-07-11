'use server'

import { z } from 'zod'

import { auth } from '@clerk/nextjs/server'

import { DIFFICULTIES } from '@/types/enums'
import type { OnboardingInput, UserDoc } from '@/types/user'

import connectDB from '@/lib/mongodb'

import { UserModel } from '@/models/user.model'

const onboardingInputSchema = z.object({
    cookingLevel: z.enum(DIFFICULTIES).optional(),
    householdSize: z.number().int().min(1).max(20).optional(),
    dietaryPreferences: z.array(z.string().min(1).max(50)).max(10).optional()
})

export const updateOnboarding = async (
    input: OnboardingInput
): Promise<UserDoc | null> => {
    const { userId: clerkId } = await auth()
    if (!clerkId) throw new Error('Unauthenticated')

    const parsedInput = onboardingInputSchema.parse(input)

    await connectDB()

    return UserModel.findOneAndUpdate(
        { clerkId },
        { ...parsedInput, onboardingCompletedAt: new Date() },
        { returnDocument: 'after', runValidators: true }
    ).lean() as Promise<UserDoc | null>
}
