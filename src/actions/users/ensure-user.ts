'use server'

import type { User } from '@/types/user'

import { auth } from '@/lib/auth'
import { toPlainDoc } from '@/lib/mongo-doc'
import connectDB from '@/lib/mongodb'

import { UserModel } from '@/models/user.model'

export const ensureUser = async (): Promise<User | null> => {
    try {
        const session = await auth()
        const userId = session?.user?.id
        if (!userId) return null

        await connectDB()

        const existing = await UserModel.findById(userId).lean()
        return existing ? toPlainDoc<User>(existing) : null
    } catch {
        return null
    }
}
