const maxImageUrlLength = 2000

export const resolveSafeImageUrl = (
    candidate: string,
    pageUrl: string
): string | undefined => {
    try {
        const resolved = new URL(candidate.trim(), pageUrl)
        const isHttp = resolved.protocol === 'http:'
            || resolved.protocol === 'https:'
        if (!isHttp || resolved.href.length > maxImageUrlLength) return undefined
        return resolved.href
    } catch {
        return undefined
    }
}
