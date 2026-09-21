import { isJsonLdRecipeNode } from '@/lib/recipes/is-json-ld-recipe-node'
import type { JsonLdNode } from '@/lib/recipes/parse-json-ld-nodes'
import {
    isJsonLdNode,
    parseJsonLdNodes
} from '@/lib/recipes/parse-json-ld-nodes'
import { resolveSafeImageUrl } from '@/lib/recipes/resolve-safe-image-url'

const readImageCandidates = (
    value: unknown,
    nodesById: Map<string, JsonLdNode>
): string[] => {
    if (typeof value === 'string') return [value]
    if (Array.isArray(value)) {
        return value.flatMap((item) => readImageCandidates(item, nodesById))
    }
    if (!isJsonLdNode(value)) return []
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
    for (const recipe of nodes.filter(isJsonLdRecipeNode)) {
        for (const candidate of readImageCandidates(recipe.image, nodesById)) {
            const resolved = resolveSafeImageUrl(candidate, pageUrl)
            if (resolved) return resolved
        }
    }
    return undefined
}
