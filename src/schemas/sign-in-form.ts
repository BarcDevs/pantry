import { z } from 'zod'

export const signInFormSchema = z.object({
    email: z.string().trim().email(),
    password: z.string().min(1)
})

export type SignInFormValues = z.infer<typeof signInFormSchema>
