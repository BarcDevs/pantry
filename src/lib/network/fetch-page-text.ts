import { fetchSafeUrl } from '@/lib/network/fetch-safe-url'

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

export const fetchPageText = async (
    url: string
): Promise<{ pageText: string, html: string } | null> => {
    let html: string | null
    try {
        html = await fetchSafeUrl(url, {
            maxBytes: maxPageBytes,
            allowedContentTypes
        })
    } catch {
        html = null
    }
    if (html === null) return null
    return {
        pageText: stripHtml(html)
            .slice(0, maxPageTextLength),
        html
    }
}
