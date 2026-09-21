import { readHeadMeta } from '@/lib/recipes/read-head-meta'
import { resolveSafeImageUrl } from '@/lib/recipes/resolve-safe-image-url'

const imageMetaKeys = [
    'og:image',
    'og:image:secure_url',
    'og:image:url',
    'twitter:image',
    'twitter:image:src'
]

export const extractOgImage = (
    html: string,
    pageUrl: string
): string | undefined => {
    const meta = readHeadMeta(html)
    for (const key of imageMetaKeys) {
        const candidate = meta.get(key)
        const resolved = candidate && resolveSafeImageUrl(candidate, pageUrl)
        if (resolved) return resolved
    }
    return undefined
}
