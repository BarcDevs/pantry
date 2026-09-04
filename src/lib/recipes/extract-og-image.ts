const maxOgImageLength = 2000

const isSafeImageUrl = (candidate: string): boolean => {
    if (candidate.length > maxOgImageLength) return false
    try {
        const { protocol } = new URL(candidate)
        return protocol === 'http:' || protocol === 'https:'
    } catch {
        return false
    }
}

export const extractOgImage = (
    html: string
): string | undefined => {
    const match = html.match(
        /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
    ) ?? html.match(
        /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i
    )
    const candidate = match?.[1]
    if (
        !candidate
        || !isSafeImageUrl(candidate)
    ) return undefined
    return candidate
}
