import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'

import env from '@/config/env'

export const authConfig: NextAuthConfig = {
    secret: env.authSecret,
    session: { strategy: 'jwt' },
    providers: [
        Google({
            clientId: env.googleClientId,
            clientSecret: env.googleClientSecret
        }),
        Credentials({
            credentials: {
                email: {},
                password: {}
            },
            authorize: async () => null
        })
    ],
    pages: {
        signIn: '/sign-in'
    }
}
