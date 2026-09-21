import { resolveSafeImageUrl } from '@/lib/recipes/resolve-safe-image-url'

type JsonLdNode = Record<string, unknown>

const jsonLdScriptPattern = /<script\b[^>]*\btype\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script\s*>/gi

const isNode = (value: unknown): value is JsonLdNode =>
    typeof value === 'object' && value !== null && !Array.isArray(value)

const flattenNodes = (value: unknown): JsonLdNode[] => {
    if (Array.isArray(value)) return value.flatMap(flattenNodes)
    if (!isNode(value)) return []
    return [
        value,
        ...flattenNodes(value['@graph'])
    ]
}

const isRecipeNode = (node: JsonLdNode): boolean => {
    const type = node['@type']
    return Array.isArray(type)
        ? type.includes('Recipe')
        : type === 'Recipe'
}

const parseJsonLdNodes = (html: string): JsonLdNode[] => {
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

const readImageCandidates = (
    value: unknown,
    nodesById: Map<string, JsonLdNode>
): string[] => {
    if (typeof value === 'string') return [value]
    if (Array.isArray(value)) {
        return value.flatMap((item) => readImageCandidates(item, nodesById))
    }
    if (!isNode(value)) return []
    const referenced = typeof value['@id'] === 'string'
        ? nodesById.get(value['@id'])
        : undefined
    const source = referenced && !value.url ? referenced : value
    return [
        source.url,
        source.contentUrl
    ].filter((candidate): candidate is string => typeof candidate === 'string')
}

export const extractJsonLdRecipeImage = (
    html: string,
    pageUrl: string
): string | undefined => {
    const nodes = parseJsonLdNodes(html)
    const nodesById = new Map<string, JsonLdNode>()
    for (const node of nodes) {
        if (typeof node['@id'] === 'string') nodesById.set(node['@id'], node)
    }
    for (const recipe of nodes.filter(isRecipeNode)) {
        for (const candidate of readImageCandidates(recipe.image, nodesById)) {
            const resolved = resolveSafeImageUrl(candidate, pageUrl)
            if (resolved) return resolved
        }
    }
    return undefined
}
