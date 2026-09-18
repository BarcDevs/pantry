'use server'

import type { ParseReceiptUrlResult } from '@/types/receipt'

import { generateStructured } from '@/lib/ai/gemini'
import { requireUserId } from '@/lib/auth/require-user-id'
import { fetchPageText } from '@/lib/network/fetch-page-text'
import { parseUrlInput } from '@/lib/network/parse-url-input'
import { mockReceiptItems } from '@/lib/pantry/mock-receipt-items'
import { buildParseReceiptUrlPrompt } from '@/lib/prompts/parse-receipt-url-prompt'

import { receiptItemsSchema } from '@/schemas/receipt-item-schema'

export const parseReceiptUrl = async (
    url: string
): Promise<ParseReceiptUrlResult> => {
    await requireUserId()
    const parsedUrl = parseUrlInput(url)
    const fetched = parsedUrl === null ? null : await fetchPageText(parsedUrl)
    if (fetched === null) {
        return {
            items: [],
            fallbackToManual: true
        }
    }

    const { items } = await generateStructured(
        buildParseReceiptUrlPrompt(fetched.pageText),
        receiptItemsSchema,
        mockReceiptItems,
        0
    ).catch((error: unknown) => {
        console.error(`[parseReceiptUrl] AI extraction failed: ${String(error)}`)
        throw error
    })
    return {
        items,
        fallbackToManual: items.length === 0
    }
}
