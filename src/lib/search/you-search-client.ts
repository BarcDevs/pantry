import type {
    RecipeSearchClient,
    SearchResult
} from '@/lib/search/types'

import { HttpStatusCodes } from '@/constants/httpStatusCodes'
import {
    excludedSearchDomains,
    searchEndpointUrl,
    searchRequestTimeoutMs,
    searchResultsCount,
    searchSafeSearchLevel
} from '@/constants/search'

type YouSearchResponse = {
    results?: {
        web?: Array<{
            url?: unknown
            title?: unknown
        }>
    }
}

const allowedProtocols = new Set([
    'http:',
    'https:'
])

const toDedupeKey = (url: string): string | null => {
    try {
        const parsed = new URL(url)
        if (!allowedProtocols.has(parsed.protocol)) return null
        return `${parsed.host}${parsed.pathname}`
    } catch {
        return null
    }
}

const toSearchResults = (payload: YouSearchResponse): SearchResult[] => {
    const seen = new Set<string>()
    const results: SearchResult[] = []
    for (const entry of payload.results?.web ?? []) {
        if (typeof entry.url !== 'string') continue
        const key = toDedupeKey(entry.url)
        if (key === null || seen.has(key)) continue
        seen.add(key)
        results.push({
            url: entry.url,
            title: typeof entry.title === 'string' ? entry.title : ''
        })
    }
    return results
}

export const createYouSearchClient = (
    apiKey: string
): RecipeSearchClient => ({
    search: async (query, options) => {
        const response = await fetch(searchEndpointUrl, {
            method: 'POST',
            headers: {
                'X-API-Key': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query,
                count: searchResultsCount,
                language: options.language,
                exclude_domains: excludedSearchDomains,
                safesearch: searchSafeSearchLevel
            }),
            signal: AbortSignal.timeout(Math.min(
                searchRequestTimeoutMs,
                options.timeoutMs ?? searchRequestTimeoutMs
            ))
        })
        if (response.status !== HttpStatusCodes.OK) {
            throw new Error(`Search request failed with status ${response.status}`)
        }
        return toSearchResults(
            await response.json() as YouSearchResponse
        )
    }
})
