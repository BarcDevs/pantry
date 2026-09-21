import type { SafeFetchResult } from '@/lib/network/fetch-safe-url'
import {
    FetchBlockedError,
    fetchSafeUrl
} from '@/lib/network/fetch-safe-url'

const maxPageTextLength = 20_000
const maxPageBytes = 200_000
const allowedContentTypes = [
    'text/html',
    'text/plain'
]

const stripHtml = (html: string): string => html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

export type PageFetchResult =
    | {
        status: 'ok'
        pageText: string
        html: string
        finalUrl: string
    }
    | { status: 'blocked' }
    | { status: 'failed' }

export const fetchPageText = async (
    url: string
): Promise<PageFetchResult> => {
    let fetched: SafeFetchResult | null
    try {
        fetched = await fetchSafeUrl(url, {
            maxBytes: maxPageBytes,
            allowedContentTypes
        })
    } catch (error) {
        return error instanceof FetchBlockedError
            ? { status: 'blocked' }
            : { status: 'failed' }
    }
    if (fetched === null) return { status: 'failed' }
    return {
        status: 'ok',
        pageText: stripHtml(fetched.body)
            .slice(0, maxPageTextLength),
        html: fetched.body,
        finalUrl: fetched.finalUrl
    }
}
