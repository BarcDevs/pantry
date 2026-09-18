'use server'

import { z } from 'zod'

import type { ParseReceiptUrlResult } from '@/types/receipt'

import { generateStructured } from '@/lib/ai/gemini'
import { requireUserId } from '@/lib/auth/require-user-id'
import { mockReceiptItems } from '@/lib/pantry/mock-receipt-items'
import { buildParseReceiptTextPrompt } from '@/lib/prompts/parse-receipt-text-prompt'

import { receiptItemsSchema } from '@/schemas/receipt-item-schema'

export const parseReceiptText = async (
    text: string
): Promise<ParseReceiptUrlResult> => {
    await requireUserId()
    const receiptText = z.string().trim().min(1).parse(text)

    const { items } = await generateStructured(
        buildParseReceiptTextPrompt(receiptText),
        receiptItemsSchema,
        mockReceiptItems,
        0
    )

    return {
        items,
        fallbackToManual: false,
        isBlocked: false
    }
}
