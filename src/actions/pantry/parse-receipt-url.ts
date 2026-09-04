'use server'

import { lookup } from 'node:dns/promises'
import { Agent } from 'undici'
import { z } from 'zod'

import type { ParseReceiptUrlResult } from '@/types/receipt'

import { generateStructured } from '@/lib/ai/gemini'
import { requireUserId } from '@/lib/auth/require-user-id'
import { isPrivateAddress } from '@/lib/network/is-private-address'
import { receiptItemsSchema } from '@/lib/pantry/receipt-item-schema'
import { buildParseReceiptUrlPrompt } from '@/lib/prompts/parse-receipt-url-prompt'

import { secondInMs } from '@/constants/time'

const maxPageTextLength = 20_000
const maxRedirects = 3
const fetchTimeoutMs = 5 * secondInMs
const allowedProtocols = new Set([
    'http:',
    'https:'
])
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

const resolveSafeAddress = async (
    candidateUrl: string
): Promise<{ address: string, family: number } | null> => {
    let parsed: URL
    try {
        parsed = new URL(candidateUrl)
    } catch {
        return null
    }
    if (!allowedProtocols.has(parsed.protocol)) return null
    try {
        const records = await lookup(parsed.hostname, { all: true })
        const safeRecord = records.find(
            ({ address }) => !isPrivateAddress(address)
        )
        const hasUnsafeRecord = records.some(
            ({ address }) => isPrivateAddress(address)
        )
        if (!safeRecord || hasUnsafeRecord) return null
        return safeRecord
    } catch {
        return null
    }
}

const pinnedDispatcher = (
    pinnedAddress: string,
    family: number
): Agent => new Agent({
    connect: {
        lookup: (_hostname, _options, callback) => {
            callback(null, [
                {
                    address: pinnedAddress,
                    family
                }
            ])
        }
    }
})

const maxPageBytes = 200_000

const readBoundedBody = async (
    response: Response
): Promise<string> => {
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    let text = ''
    let bytesRead = 0
    while (reader && bytesRead < maxPageBytes) {
        const { done, value } = await reader.read()
        if (done) break
        const remaining = maxPageBytes - bytesRead
        const chunk = value.length > remaining
            ? value.subarray(0, remaining)
            : value
        bytesRead += chunk.length
        text += decoder.decode(chunk, { stream: true })
    }
    await reader?.cancel()
    return text.slice(0, maxPageTextLength)
}

const fetchSafely = async (
    startUrl: string
): Promise<string | null> => {
    let currentUrl = startUrl
    for (let hop = 0; hop <= maxRedirects; hop += 1) {
        const safeAddress = await resolveSafeAddress(currentUrl)
        if (!safeAddress) return null
        const response = await fetch(currentUrl, {
            redirect: 'manual',
            signal: AbortSignal.timeout(fetchTimeoutMs),
            dispatcher: pinnedDispatcher(
                safeAddress.address,
                safeAddress.family
            )
        } as RequestInit)
        const isRedirect = response.status >= 300
            && response.status < 400
        if (isRedirect) {
            const location = response.headers.get('location')
            if (!location) return null
            currentUrl = new URL(location, currentUrl).toString()
            continue
        }
        if (!response.ok) return null
        const contentType = response.headers.get('content-type') ?? ''
        const isAllowedType = allowedContentTypes.some(
            (allowed) => contentType.includes(allowed)
        )
        if (!isAllowedType) return null
        return readBoundedBody(response)
    }
    return null
}

export const parseReceiptUrl = async (
    url: string
): Promise<ParseReceiptUrlResult> => {
    await requireUserId()
    const parsedUrl = z.string().url().parse(url)

    let pageText: string
    try {
        const html = await fetchSafely(parsedUrl)
        if (html === null) {
            return {
                items: [],
                fallbackToManual: true
            }
        }
        pageText = stripHtml(html)
    } catch {
        return {
            items: [],
            fallbackToManual: true
        }
    }

    const { items } = await generateStructured(
        buildParseReceiptUrlPrompt(pageText),
        receiptItemsSchema,
        () => ({ items: [] }),
        0
    )
    return {
        items,
        fallbackToManual: false
    }
}
