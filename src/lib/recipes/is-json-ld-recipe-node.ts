import type { JsonLdNode } from '@/lib/recipes/parse-json-ld-nodes'

export const isJsonLdRecipeNode = (node: JsonLdNode): boolean => {
    const type = node['@type']
    return Array.isArray(type)
        ? type.includes('Recipe')
        : type === 'Recipe'
}
