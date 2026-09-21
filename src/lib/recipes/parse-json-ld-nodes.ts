export type JsonLdNode = Record<string, unknown>

const jsonLdScriptPattern = /<script\b[^>]*\btype\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script\s*>/gi

export const isJsonLdNode = (value: unknown): value is JsonLdNode =>
    typeof value === 'object' && value !== null && !Array.isArray(value)

const flattenNodes = (value: unknown): JsonLdNode[] => {
    if (Array.isArray(value)) return value.flatMap(flattenNodes)
    if (!isJsonLdNode(value)) return []
    return [
        value,
        ...flattenNodes(value['@graph'])
    ]
}

export const parseJsonLdNodes = (html: string): JsonLdNode[] => {
    const nodes: JsonLdNode[] = []
    for (const match of html.matchAll(jsonLdScriptPattern)) {
        try {
            nodes.push(...flattenNodes(JSON.parse(match[1])))
        } catch {
            continue
        }
    }
    return nodes
}
