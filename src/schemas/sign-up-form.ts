import { z } from 'zod'

import { authTexts } from '@/constants/texts/auth'

export const signUpFormSchema = z.object({
    fullName: z.string().trim().min(1).max(100),
    email: z.string().trim().email(),
    password: z.string().min(8, { message: authTexts.passwordTooShort })
})

export type SignUpFormValues = z.infer<typeof signUpFormSchema>
