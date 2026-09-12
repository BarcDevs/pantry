import { NextResponse } from 'next/server'

import { auth } from '@/lib/auth/edge'

import { routes } from '@/constants/routes'

const publicRoutePrefixes = [
    routes.signIn,
    routes.signUp,
    routes.forgotPassword,
    routes.landing
]

const isPublicRoute = (pathname: string): boolean => (
    pathname === routes.landing
        || pathname.startsWith('/api/auth')
        || publicRoutePrefixes.some(
            (route) => route !== routes.landing && pathname.startsWith(route)
        )
)

export default auth((req) => {
    if (!req.auth && !isPublicRoute(req.nextUrl.pathname)) {
        const signInUrl = new URL(routes.signIn, req.nextUrl.origin)
        return NextResponse.redirect(signInUrl)
    }
    return NextResponse.next()
})

export const config = {
    matcher: ['/((?!_next|.*\\..*).*)']
}
