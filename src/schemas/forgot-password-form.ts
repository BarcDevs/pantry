import { z } from 'zod'

import { authTexts } from '@/constants/texts/auth'

export const forgotPasswordFormSchema = z.object({
    email: z.string().trim().email(),
    password: z.string().min(8, { message: authTexts.passwordTooShort }),
    confirmPassword: z.string()
}).refine((values) => values.password === values.confirmPassword, {
    message: authTexts.passwordMismatch,
    path: ['confirmPassword']
})

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>
