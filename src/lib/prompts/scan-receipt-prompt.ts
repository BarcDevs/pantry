import { receiptItemExtractionInstructions } from '@/lib/prompts/receipt-item-extraction-instructions'

export const buildScanReceiptPrompt = (): string => `
    זוהי תמונה של קבלת קניות. חלץ מתוכה את כל פריטי המזון שנרכשו.
    ${receiptItemExtractionInstructions}
`
