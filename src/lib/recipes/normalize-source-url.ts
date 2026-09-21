import { parseHttpUrl } from '@/lib/recipes/parse-http-url'

const trailingSlashes = /\/+$/

/**
 * Identity of a recipe page for "already shown" checks: lowercase host without
 * `www.` plus the path without trailing slashes. Scheme, query and hash are
 * ignored. Falls back to the trimmed lowercase input when it is not a URL.
 */
export const normalizeSourceUrl = (url: string): string => {
    const parsed = parseHttpUrl(url)
    if (!parsed) return url.trim().toLowerCase()
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '')
    return `${host}${parsed.pathname.replace(trailingSlashes, '')}`
}
