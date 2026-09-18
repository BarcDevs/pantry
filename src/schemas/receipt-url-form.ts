import { z } from 'zod'

import { parseUrlInput } from '@/lib/network/parse-url-input'

import { pantryTexts } from '@/constants/texts/pantry'

export const receiptUrlSchema = z.string().refine(
    (value) => parseUrlInput(value) !== null,
    { message: pantryTexts.receiptReview.urlInvalid }
)
