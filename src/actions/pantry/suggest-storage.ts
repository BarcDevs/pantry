'use server'

import { z } from 'zod'

import { STORAGE_LOCATIONS } from '@/types/enums'
import type { StorageSuggestion } from '@/types/pantry-item'

import { generateStructured } from '@/lib/ai/gemini'
import { requireUserId } from '@/lib/auth/require-user-id'

const expiryEntrySchema = z.object({
    date: z.string(),
    reason: z.string()
})

const storageSuggestionSchema = z.object({
    suggestedStorage: z.enum(STORAGE_LOCATIONS),
    reason: z.string(),
    expiryByStorage: z.object({
        fridge: expiryEntrySchema,
        freezer: expiryEntrySchema,
        pantry: expiryEntrySchema
    })
})

export const suggestStorage = async (
    name: string
): Promise<StorageSuggestion> => {
    await requireUserId()
    const parsedName = z.string().trim().min(1).max(100).parse(name)

    const prompt = `
        המוצר: "${parsedName}".
        המלץ על מיקום האחסון הטוב ביותר (מקרר / מקפיא / מזווה) עבור מוצר מזון זה,
        ותן תאריך תפוגה משוער וסיבה קצרה עבור כל אחד משלושת מיקומי האחסון בנפרד.
        כל סיבה צריכה להיות משמעותית בפני עצמה (למשל "שומר על טריות ומרקם" ולא רק "X ימים").
        תאריכי התפוגה חייבים להיות תאריכים עתידיים ריאליים ביחס להיום, בפורמט YYYY-MM-DD.
    `

    return generateStructured(
        prompt,
        storageSuggestionSchema
    )
}
