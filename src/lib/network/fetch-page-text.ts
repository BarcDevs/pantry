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
    }
    | { status: 'blocked' }
    | { status: 'failed' }

export const fetchPageText = async (
    url: string
): Promise<PageFetchResult> => {
    let html: string | null
    try {
        html = await fetchSafeUrl(url, {
            maxBytes: maxPageBytes,
            allowedContentTypes
        })
    } catch (error) {
        return error instanceof FetchBlockedError
            ? { status: 'blocked' }
            : { status: 'failed' }
    }
    if (html === null) return { status: 'failed' }
    return {
        status: 'ok',
        pageText: stripHtml(html)
            .slice(0, maxPageTextLength),
        html
    }
}
