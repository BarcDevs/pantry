'use server'

import { z } from 'zod'

import type { ParseReceiptUrlResult } from '@/types/receipt'

import { generateStructured } from '@/lib/ai/gemini'
import { requireUserId } from '@/lib/auth/require-user-id'
import { fetchPageText } from '@/lib/network/fetch-page-text'
import { mockReceiptItems } from '@/lib/pantry/mock-receipt-items'
import { receiptItemsSchema } from '@/lib/pantry/receipt-item-schema'
import { buildParseReceiptUrlPrompt } from '@/lib/prompts/parse-receipt-url-prompt'

export const parseReceiptUrl = async (
    url: string
): Promise<ParseReceiptUrlResult> => {
    await requireUserId()
    const parsedUrl = z.url().parse(url)

    const fetched = await fetchPageText(parsedUrl)
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
    )
    return {
        items,
        fallbackToManual: false
    }
}
