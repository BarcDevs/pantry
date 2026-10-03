import { generateText } from 'ai'

import { resolveSafeImageUrl } from '@/lib/recipes/resolve-safe-image-url'

import { aiModel, google } from '@/config/ai'
import env from '@/config/env'

type GroundingChunk = {
    web?: {
        uri: string
    } | null
}

const ogImagePattern
    = /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i

const extractPageImageUrl = async (
    pageRedirectUrl: string
): Promise<string | null> => {
    const response = await fetch(pageRedirectUrl, { redirect: 'follow' })
    if (!response.ok) return null

    const html = await response.text()
    const ogImage = html.match(ogImagePattern)?.[1]
    if (!ogImage) return null

    return resolveSafeImageUrl(ogImage, response.url) ?? null
}

const findImageFromGroundingChunks = async (
    groundingChunks: GroundingChunk[] | null | undefined
): Promise<string | null> => {
    for (const chunk of groundingChunks ?? []) {
        const uri = chunk.web?.uri
        if (!uri) continue
        const imageUrl = await extractPageImageUrl(uri)
        if (imageUrl) return imageUrl
    }
    return null
}

/**
 * Server-side Gemini Search Grounding call (google_search tool, plain web
 * search - imageSearch grounding is Google-gated to image-generation models
 * only, unavailable on any free/paid text model) - never invoked
 * automatically, only on explicit user tap (AC-3.11b). Finds a real recipe
 * page via grounded web search, then scrapes its og:image. Only trusts
 * grounded chunk URLs, never the model's free-text answer, since the model
 * can skip calling the tool and hallucinate a URL instead.
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

    const result = await generateText({
        model: aiModel,
        tools: {
            google_search: google.tools.googleSearch({})
        },
        prompt: `Use the google_search tool right now to look up a recipe
            matching "${title}" (ingredients: ${ingredients.join(', ')}).
            Then tell me the exact title of the first search result.`
    })

    const groundingMetadata = result.providerMetadata
        ?.google?.groundingMetadata as { groundingChunks?: GroundingChunk[] } | undefined

    return findImageFromGroundingChunks(groundingMetadata?.groundingChunks)
}
