import { z } from 'zod'

import { OTP_LENGTH } from '@/constants/auth'
import { authTexts } from '@/constants/texts/auth'

export const requestFormSchema = z.object({
    email: z.string().trim().email()
})

export const codeFormSchema = z.object({
    code: z.string().trim().length(OTP_LENGTH, { message: authTexts.codeTooShort })
})

export const newPasswordFormSchema = z.object({
    password: z.string().min(8, { message: authTexts.passwordTooShort }),
    confirmPassword: z.string()
}).refine((values) => values.password === values.confirmPassword, {
    message: authTexts.passwordMismatch,
    path: ['confirmPassword']
})

export type RequestFormValues = z.infer<typeof requestFormSchema>
export type CodeFormValues = z.infer<typeof codeFormSchema>
export type NewPasswordFormValues = z.infer<typeof newPasswordFormSchema>
