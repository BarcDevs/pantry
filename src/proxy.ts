import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/users/sync'
])

export default clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)) await auth.protect()
})

export const config = {
    matcher: [
        '/((?!_next|.*\\..*).*)' ,
        '/__clerk/:path*'
    ]
}
