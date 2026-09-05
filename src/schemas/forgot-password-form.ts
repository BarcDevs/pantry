import { z } from 'zod'

import { authTexts } from '@/constants/texts/auth'

export const requestFormSchema = z.object({
    email: z.string().trim().email()
})

export const resetFormSchema = z.object({
    code: z.string().trim().length(6, { message: authTexts.codeTooShort }),
    password: z.string().min(8)
})

export type RequestFormValues = z.infer<typeof requestFormSchema>
export type ResetFormValues = z.infer<typeof resetFormSchema>
