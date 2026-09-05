import { z } from 'zod'

import { authTexts } from '@/constants/texts/auth'

export const signUpFormSchema = z.object({
    fullName: z.string().trim().min(1).max(100),
    email: z.string().trim().email(),
    password: z.string().min(8)
})

export const verifyFormSchema = z.object({
    code: z.string().trim().length(6, { message: authTexts.codeTooShort })
})

export type SignUpFormValues = z.infer<typeof signUpFormSchema>
export type VerifyFormValues = z.infer<typeof verifyFormSchema>
