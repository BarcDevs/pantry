import { resolveSafeImageUrl } from '@/lib/recipes/resolve-safe-image-url'

const metaTagPattern = /<meta\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi
const attributePattern = /([^\s"'=<>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g
const namedEntities: Record<string, string> = {
    amp: '&',
    quot: '"',
    apos: '\'',
    lt: '<',
    gt: '>'
}
const imageMetaKeys = [
    'og:image',
    'og:image:secure_url',
    'og:image:url',
    'twitter:image',
    'twitter:image:src'
]

const decodeHtmlEntities = (value: string): string => value
    .replace(
        /&(?:#(\d+)|#x([\da-f]+)|([a-z]+));/gi,
        (entity, decimal, hex, name) => {
            if (name) return namedEntities[name.toLowerCase()] ?? entity
            const codePoint = decimal
                ? Number(decimal)
                : parseInt(hex, 16)
            try {
                return String.fromCodePoint(codePoint)
            } catch {
                return entity
            }
        }
    )

const readHead = (html: string): string => {
    const headEnd = html.search(/<\/head\s*>/i)
    return headEnd === -1 ? html : html.slice(0, headEnd)
}

const readAttributes = (tag: string): Map<string, string> => {
    const attributes = new Map<string, string>()
    for (const match of tag.slice(5).matchAll(attributePattern)) {
        const name = match[1].toLowerCase()
        if (attributes.has(name)) continue
        attributes.set(name, match[2] ?? match[3] ?? match[4] ?? '')
    }
    return attributes
}

export const extractOgImage = (
    html: string,
    pageUrl: string
): string | undefined => {
    const candidates = new Map<string, string>()
    for (const [tag] of readHead(html).matchAll(metaTagPattern)) {
        const attributes = readAttributes(tag)
        const key = (attributes.get('property') ?? attributes.get('name'))
            ?.trim()
            .toLowerCase()
        const content = attributes.get('content')
        if (!key || !content || !imageMetaKeys.includes(key)) continue
        if (!candidates.has(key)) candidates.set(key, decodeHtmlEntities(content))
    }
    for (const key of imageMetaKeys) {
        const candidate = candidates.get(key)
        const resolved = candidate && resolveSafeImageUrl(candidate, pageUrl)
        if (resolved) return resolved
    }
    return undefined
}
