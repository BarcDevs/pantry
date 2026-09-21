import { isJsonLdRecipeNode } from '@/lib/recipes/is-json-ld-recipe-node'
import {
    isJsonLdNode,
    parseJsonLdNodes
} from '@/lib/recipes/parse-json-ld-nodes'
import { readHeadMeta } from '@/lib/recipes/read-head-meta'

const maxSourceNameLength = 100
const wwwPrefix = /^www\./i

const readName = (value: unknown): string | undefined => {
    if (typeof value === 'string') return value.trim() || undefined
    if (Array.isArray(value)) {
        return value
            .map(readName)
            .find((name) => name !== undefined)
    }
    if (isJsonLdNode(value)) return readName(value.name)
    return undefined
}

const readPublisherName = (html: string): string | undefined => {
    for (const recipe of parseJsonLdNodes(html).filter(isJsonLdRecipeNode)) {
        const name = readName(recipe.publisher)
        if (name) return name
    }
    return undefined
}

const readHostname = (pageUrl: string): string | undefined => {
    try {
        return new URL(pageUrl).hostname.replace(wwwPrefix, '') || undefined
    } catch {
        return undefined
    }
}

/**
 * Human-readable website name of a recipe page: schema.org Recipe
 * `publisher.name`, then `<meta property="og:site_name">`, then the hostname
 * without `www.`. Capped at the stored max length.
 */
export const extractRecipeSourceName = (
    html: string,
    pageUrl: string
): string | undefined => (
    readPublisherName(html)
    ?? readHeadMeta(html).get('og:site_name')?.trim()
    ?? readHostname(pageUrl)
)?.slice(0, maxSourceNameLength)
