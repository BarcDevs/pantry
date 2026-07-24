'use server'

import { z } from 'zod'

import { auth } from '@clerk/nextjs/server'

import type { User, UserProfileInput } from '@/types/user'

import { toPlainDoc } from '@/lib/mongo-doc'
import connectDB from '@/lib/mongodb'

import { UserModel } from '@/models/user.model'
import { userProfileFieldsSchema } from '@/schemas/user-profile'

const updateUserProfileSchema = userProfileFieldsSchema.extend({
    displayName: z.string().trim().min(1).max(100).optional()
})

export const updateUserProfile = async (
    input: UserProfileInput
): Promise<User> => {
    const { userId: clerkId } = await auth()
    if (!clerkId) throw new Error('Unauthenticated')

    const parsedInput = updateUserProfileSchema.parse(input)

    await connectDB()

    const updated = await UserModel.findOneAndUpdate(
        { clerkId },
        parsedInput,
        { returnDocument: 'after', runValidators: true }
    ).lean()

    if (!updated) throw new Error('User not found')
    return toPlainDoc<User>(updated)
}
