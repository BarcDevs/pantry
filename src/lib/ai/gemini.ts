import { generateObject } from 'ai'
import { type ZodType } from 'zod'

import { aiModel } from '@/config/ai'

export const generateStructured = async <T>(
    prompt: string,
    schema: ZodType<T>
): Promise<T> => {
    const { object: parsed } = await generateObject({
        model: aiModel,
        prompt,
        schema
    })
    return parsed
}
