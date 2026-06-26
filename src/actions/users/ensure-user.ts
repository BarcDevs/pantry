'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'

import type { UserDoc } from '@/types/user'

import connectDB from '@/lib/mongodb'

import { UserModel } from '@/models/user.model'

export const ensureUser = async (): Promise<UserDoc | null> => {
    try {
        const { userId: clerkId } = await auth()
        if (!clerkId) return null

        await connectDB()

        const existing = await UserModel.findOne({ clerkId }).lean()
        if (existing) return existing as UserDoc

        // Webhook may be delayed - seed from Clerk API as fallback
        const client = await clerkClient()
        const clerkUser = await client.users.getUser(clerkId)
        const email = clerkUser.emailAddresses[0]?.emailAddress ?? ''
        const displayName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || email

        try {
            const created = await UserModel.create({
                clerkId,
                email,
                displayName,
                dietaryPreferences: [],
                onboardingCompletedAt: null
            })
            return created.toObject() as UserDoc
        } catch (err: unknown) {
            if ((err as { code?: number }).code === 11000) {
                return UserModel.findOne({ clerkId }).lean() as Promise<UserDoc | null>
            }
            throw err
        }
    } catch {
        return null
    }
}
