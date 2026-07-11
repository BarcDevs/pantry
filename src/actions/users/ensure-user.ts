'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'

import type { User } from '@/types/user'

import { toPlainDoc } from '@/lib/mongo-doc'
import connectDB from '@/lib/mongodb'

import { UserModel } from '@/models/user.model'

export const ensureUser = async (): Promise<User | null> => {
    try {
        const { userId: clerkId } = await auth()
        if (!clerkId) return null

        await connectDB()

        const existing = await UserModel.findOne({
            clerkId
        }).lean()
        if (existing) return toPlainDoc<User>(existing)

        // Webhook may be delayed - seed from Clerk API as fallback
        const client = await clerkClient()
        const clerkUser = await client.users.getUser(clerkId)
        const email = clerkUser.emailAddresses[0]?.emailAddress ?? ''
        const names = [
            clerkUser.firstName,
            clerkUser.lastName
        ].filter(Boolean).join(' ')
        const displayName = names || email

        try {
            const created = await UserModel.create({
                clerkId,
                email,
                displayName,
                dietaryPreferences: [],
                onboardingCompletedAt: null
            })
            return toPlainDoc<User>(created.toObject())
        } catch (err: unknown) {
            if ((err as { code?: number }).code === 11000) {
                const fallback = await UserModel
                    .findOne({ clerkId }).lean()
                return fallback ? toPlainDoc<User>(fallback) : null
            }
            throw err
        }
    } catch {
        return null
    }
}
