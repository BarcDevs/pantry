import { z } from 'zod'

export const signUpFormSchema = z.object({
    fullName: z.string().trim().min(1).max(100),
    email: z.string().trim().email(),
    password: z.string().min(8)
})

export const verifyFormSchema = z.object({
    code: z.string().trim().min(6).max(6)
})

export type SignUpFormValues = z.infer<typeof signUpFormSchema>
export type VerifyFormValues = z.infer<typeof verifyFormSchema>
