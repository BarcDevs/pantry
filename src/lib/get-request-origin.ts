import { headers } from 'next/headers'

import appConfig from '@/config/app'

// Server actions run within the request they were called from, so the actual
// origin (dev/preview/prod) can be read off its headers - falls back to the
// configured production URL when no request context is available (scripts, tests).
export const getRequestOrigin = async (): Promise<string> => {
    try {
        const headersList = await headers()
        const host = headersList.get('x-forwarded-host') ?? headersList.get('host')
        if (!host) return appConfig.url

        const protocol = headersList.get('x-forwarded-proto') ?? (host.includes('localhost') ? 'http' : 'https')
        return `${protocol}://${host}`
    } catch {
        return appConfig.url
    }
}
