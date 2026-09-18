const SCHEME_PATTERN = /^[a-z][a-z0-9+.-]*:\/\//i

export const parseUrlInput = (input: string): string | null => {
    const trimmed = input.trim()
    if (trimmed.length === 0) {
        return null
    }

    const candidate = SCHEME_PATTERN.test(trimmed)
        ? trimmed
        : `https://${trimmed}`

    try {
        const url = new URL(candidate)
        const isWebProtocol = url.protocol === 'http:' || url.protocol === 'https:'
        const hasDomain = url.hostname.includes('.')
        return isWebProtocol && hasDomain ? url.toString() : null
    } catch {
        return null
    }
}

export const isUrlInputInvalid = (input: string): boolean => (
    input.trim().length > 0 && parseUrlInput(input) === null
)
