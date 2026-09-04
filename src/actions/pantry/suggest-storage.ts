'use server'

import { z } from 'zod'

import type { StorageSuggestion } from '@/types/pantry-item'

import { generateStructured } from '@/lib/ai/gemini'
import { requireUserId } from '@/lib/auth/require-user-id'
import { storageSuggestionShape } from '@/lib/pantry/storage-suggestion-schema'

export const suggestStorage = async (
    name: string
): Promise<StorageSuggestion> => {
    await requireUserId()
    const parsedName = z.string().trim().min(1).max(100).parse(name)
    const today = new Date().toISOString().slice(0, 10)

    const prompt = `
        תאריך היום: ${today}.
        המוצר: "${parsedName}".
        קודם כל, קבע האם "${parsedName}" הוא שם סביר של מוצר מזון אמיתי. אם זו מחרוזת חסרת משמעות, קלט מקרי,
        או משהו שאינו שם של מוצר מזון (למשל "ggggg" או "asdf"), החזר recognized: false, ועדיין מלא את שאר
        השדות עם ניחוש כללי סביר (למשל מזווה, ~7 ימים) כברירת מחדל בלבד.
        אם זהו שם סביר של מוצר מזון, החזר recognized: true והמלץ על מיקום האחסון הטוב ביותר
        (מקרר / מקפיא / מזווה) עבור מוצר מזון זה, ותן תאריך תפוגה משוער וסיבה קצרה עבור כל אחד
        משלושת מיקומי האחסון בנפרד.
        כל סיבה צריכה להיות משמעותית בפני עצמה (למשל "שומר על טריות ומרקם" ולא רק "X ימים").
        תאריכי התפוגה חייבים להיות תאריכים עתידיים ביחס לתאריך היום שניתן למעלה, בפורמט YYYY-MM-DD.
        לדוגמה, אם משך החיים המשוער הוא 5 ימים, התאריך המוחזר חייב להיות 5 ימים אחרי תאריך היום.
        אם ניתן לזהות בביטחון את סוג המוצר (ירקות / פירות / מוצרי חלב / ביצים / בשר / דגים / שימורים / דגנים / חטיפים / משקאות / תבלינים ורטבים / אחר), ציין אותו כ-suggestedType. אם אין ביטחון, השאר את suggestedType כ-null.
    `

    const mockEntry = {
        date: '2099-01-01',
        reason: 'בדיקה'
    }

    return generateStructured(
        prompt,
        storageSuggestionShape,
        () => ({
            recognized: true,
            suggestedStorage: 'pantry',
            suggestedType: null,
            reason: 'בדיקה',
            expiryByStorage: {
                fridge: mockEntry,
                freezer: mockEntry,
                pantry: mockEntry
            }
        }),
        0
    )
}
