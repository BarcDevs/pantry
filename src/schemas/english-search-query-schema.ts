import { z } from 'zod'

export const englishSearchQuerySchema = z.object({
    query: z.string().trim().min(1).max(200)
})

export type EnglishSearchQuery = z.infer<typeof englishSearchQuerySchema>
