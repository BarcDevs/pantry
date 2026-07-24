import { z } from 'zod'

export const requestFormSchema = z.object({
    email: z.string().trim().email()
})

export const resetFormSchema = z.object({
    code: z.string().trim().min(6).max(6),
    password: z.string().min(8)
})

export type RequestFormValues = z.infer<typeof requestFormSchema>
export type ResetFormValues = z.infer<typeof resetFormSchema>
