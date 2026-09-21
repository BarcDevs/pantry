const metaTagPattern = /<meta\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi
const attributePattern = /([^\s"'=<>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g
const namedEntities: Record<string, string> = {
    amp: '&',
    quot: '"',
    apos: '\'',
    lt: '<',
    gt: '>'
}

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

/**
 * Non-empty `<meta>` contents in the document head, keyed by lowercased
 * `property` (or `name`). The first tag wins when a key repeats.
 */
export const readHeadMeta = (html: string): Map<string, string> => {
    const contents = new Map<string, string>()
    for (const [tag] of readHead(html).matchAll(metaTagPattern)) {
        const attributes = readAttributes(tag)
        const key = (attributes.get('property') ?? attributes.get('name'))
            ?.trim()
            .toLowerCase()
        const content = attributes.get('content')
        if (!key || !content) continue
        if (!contents.has(key)) contents.set(key, decodeHtmlEntities(content))
    }
    return contents
}
