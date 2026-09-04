'use server'

import { z } from 'zod'

import type { ScannedReceiptItem } from '@/types/receipt'

import { generateStructured } from '@/lib/ai/gemini'
import { requireUserId } from '@/lib/auth/require-user-id'
import { receiptItemsSchema } from '@/lib/pantry/receipt-item-schema'
import { buildScanReceiptPrompt } from '@/lib/prompts/scan-receipt-prompt'

const maxBase64Length = 10_000_000
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'] as const

export const scanReceipt = async (
    base64Image: string,
    mimeType: string
): Promise<ScannedReceiptItem[]> => {
    await requireUserId()
    const parsedBase64 = z
        .string()
        .trim()
        .min(1)
        .max(maxBase64Length)
        .parse(base64Image)
    const parsedMimeType = z
        .enum(allowedMimeTypes)
        .parse(mimeType)

    const { items } = await generateStructured(
        buildScanReceiptPrompt(),
        receiptItemsSchema,
        () => ({ items: [] }),
        0,
        {
            base64: parsedBase64,
            mimeType: parsedMimeType
        }
    )
    return items
}
