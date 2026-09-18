import { lookup } from 'node:dns/promises'
import { Agent } from 'undici'

import { isPrivateAddress } from '@/lib/network/is-private-address'

import { secondInMs } from '@/constants/time'

const maxRedirects = 3
const fetchTimeoutMs = 5 * secondInMs
const browserHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'he-IL,he;q=0.9,en;q=0.8'
}
const blockedStatuses = new Set([
    401,
    403,
    429
])
const allowedProtocols = new Set([
    'http:',
    'https:'
])

const hostnameOf = (url: string): string => {
    try {
        return new URL(url).hostname
    } catch {
        return 'invalid-url'
    }
}

const logFetchFailure = (url: string, reason: string): void => {
    console.error(`[fetchSafeUrl] ${hostnameOf(url)}: ${reason}`)
}

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

const readBoundedBody = async (
    response: Response,
    maxBytes: number
): Promise<string> => {
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    let text = ''
    let bytesRead = 0
    while (reader && bytesRead < maxBytes) {
        const { done, value } = await reader.read()
        if (done) break
        const remaining = maxBytes - bytesRead
        const chunk = value.length > remaining
            ? value.subarray(0, remaining)
            : value
        bytesRead += chunk.length
        text += decoder.decode(chunk, { stream: true })
    }
    await reader?.cancel()
    return text
}

export class FetchBlockedError extends Error {}

export type FetchSafeUrlOptions = {
    maxBytes: number
    allowedContentTypes: string[]
}

export const fetchSafeUrl = async (
    startUrl: string,
    options: FetchSafeUrlOptions
): Promise<string | null> => {
    let currentUrl = startUrl
    for (let hop = 0; hop <= maxRedirects; hop += 1) {
        const safeAddress = await resolveSafeAddress(currentUrl)
        if (!safeAddress) {
            logFetchFailure(currentUrl, 'blocked or unresolvable address')
            return null
        }
        let response: Response
        try {
            response = await fetch(currentUrl, {
                redirect: 'manual',
                headers: browserHeaders,
                signal: AbortSignal.timeout(fetchTimeoutMs),
                dispatcher: pinnedDispatcher(
                    safeAddress.address,
                    safeAddress.family
                )
            } as RequestInit)
        } catch (error) {
            logFetchFailure(currentUrl, `request failed: ${String(error)}`)
            throw error
        }
        const isRedirect = response.status >= 300
            && response.status < 400
        if (isRedirect) {
            const location = response.headers.get('location')
            if (!location) {
                logFetchFailure(currentUrl, 'redirect without location')
                return null
            }
            currentUrl = new URL(
                location,
                currentUrl
            ).toString()
            continue
        }
        if (!response.ok) {
            logFetchFailure(currentUrl, `HTTP ${response.status}`)
            if (blockedStatuses.has(response.status)) {
                throw new FetchBlockedError(`HTTP ${response.status}`)
            }
            return null
        }
        const contentType = response.headers.get('content-type') ?? ''
        const isAllowedType = options.allowedContentTypes.some(
            (allowed) => contentType.includes(allowed)
        )
        if (!isAllowedType) {
            logFetchFailure(currentUrl, `content-type "${contentType}" not allowed`)
            return null
        }
        return readBoundedBody(response, options.maxBytes)
    }
    logFetchFailure(currentUrl, 'too many redirects')
    return null
}
