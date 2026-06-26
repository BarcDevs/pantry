import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

import { endpoints } from '@/constants/endpoints'
import { routes } from '@/constants/routes'

const isPublicRoute = createRouteMatcher([
    `${routes.signIn}(.*)`,
    `${routes.signUp}(.*)`,
    routes.landing,
    endpoints.usersSync
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
