const httpProtocols = ['http:', 'https:']

/** The parsed URL when it is a valid http/https URL, otherwise undefined. */
export const parseHttpUrl = (value: string): URL | undefined => {
    try {
        const parsed = new URL(value)
        return httpProtocols.includes(parsed.protocol) ? parsed : undefined
    } catch {
        return undefined
    }
}
