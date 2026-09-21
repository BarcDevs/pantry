import { extractJsonLdRecipeImage } from '@/lib/recipes/extract-json-ld-recipe-image'
import { extractOgImage } from '@/lib/recipes/extract-og-image'

export const extractRecipeImage = (
    html: string,
    pageUrl: string
): string | undefined =>
    extractJsonLdRecipeImage(html, pageUrl) ?? extractOgImage(html, pageUrl)
