import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'

import bcrypt from 'bcryptjs'

import { authConfig } from '@/lib/auth/config'
import connectDB from '@/lib/mongodb'

import env from '@/config/env'

import { UserModel } from '@/models/user.model'

const providers = [
    Google({
        clientId: env.googleClientId,
        clientSecret: env.googleClientSecret
    }),
    Credentials({
        credentials: {
            email: {},
            password: {}
        },
        authorize: async (credentials) => {
            const email = credentials?.email as string | undefined
            const password = credentials?.password as string | undefined
            if (!email || !password) return null

            await connectDB()
            const user = await UserModel.findOne({ email }).lean()
            if (!user || !user.passwordHash || !user.emailVerifiedAt) return null

            const isValid = await bcrypt.compare(password, user.passwordHash)
            if (!isValid) return null

            return {
                id: user._id.toString(),
                email: user.email,
                name: user.displayName
            }
        }
    })
]

export const {
    handlers,
    auth,
    signIn,
    signOut
} = NextAuth({
    ...authConfig,
    providers,
    callbacks: {
        signIn: async ({ user, account }) => {
            if (account?.provider !== 'google') return true

            await connectDB()
            const email = user.email
            if (!email) return false

            const existing = await UserModel.findOne({ email })
            if (existing) {
                if (!existing.emailVerifiedAt) {
                    existing.emailVerifiedAt = new Date()
                    await existing.save()
                }
                return true
            }

            await UserModel.create({
                email,
                displayName: user.name ?? email,
                emailVerifiedAt: new Date(),
                dietaryPreferences: [],
                onboardingCompletedAt: null
            })
            return true
        },
        jwt: async ({ token, user }) => {
            if (user?.email) {
                await connectDB()
                const dbUser = await UserModel.findOne({ email: user.email }).lean()
                if (dbUser) token.userId = dbUser._id.toString()
            }
            return token
        },
        session: async ({ session, token }) => {
            if (session.user) session.user.id = token.userId as string
            return session
        }
    }
})
