import { generateText } from 'ai'

import { resolveSafeImageUrl } from '@/lib/recipes/resolve-safe-image-url'

import { google } from '@/config/ai'
import env from '@/config/env'

type GroundingChunk = {
    image?: {
        imageUri: string
    } | null
}

const extractImageUrl = (
    groundingChunks: GroundingChunk[] | null | undefined
): string | null => {
    for (const chunk of groundingChunks ?? []) {
        const imageUri = chunk.image?.imageUri
        if (!imageUri) continue
        const resolved = resolveSafeImageUrl(imageUri, imageUri)
        if (resolved) return resolved
    }
    return null
}

/**
 * Server-side Gemini Search Grounding call (google_search tool, image
 * search type) - never invoked automatically, only on explicit user tap
 * (AC-3.11b). Returns the first valid image URL among the grounded image
 * search results, or null when none qualify.
 */
export const searchRecipeImage = async (
    title: string,
    ingredients: string[],
    mock?: () => string | null
): Promise<string | null> => {
    if (env.e2eMockAi) {
        if (!mock) {
            throw new Error(
                'searchRecipeImage called without a mock while E2E_MOCK_AI=true'
            )
        }
        return mock()
    }

    // Google Image Search grounding is only supported by the
    // gemini-*-flash-image models, not the flash-lite model used elsewhere.
    const result = await generateText({
        model: google(env.geminiImageSearchModelId),
        tools: {
            google_search: google.tools.googleSearch({
                searchTypes: { imageSearch: {} }
            })
        },
        prompt: `חפש תמונה אחת מתאימה למתכון "${title}" עם המרכיבים
            המרכזיים הבאים: ${ingredients.join(', ')}.`
    })

    const groundingMetadata = result.providerMetadata
        ?.google?.groundingMetadata as { groundingChunks?: GroundingChunk[] } | undefined

    return extractImageUrl(groundingMetadata?.groundingChunks)
}
