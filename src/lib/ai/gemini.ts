import { generateObject } from 'ai'
import { type ZodType } from 'zod'

import { aiModel } from '@/config/ai'
import env from '@/config/env'

export const generateStructured = async <T>(
    prompt: string,
    schema: ZodType<T>,
    mock?: () => T
): Promise<T> => {
    if (env.e2eMockAi) {
        if (!mock) {
            throw new Error(
                'generateStructured called without a mock while E2E_MOCK_AI=true'
            )
        }
        return mock()
    }

    const { object: parsed } = await generateObject({
        model: aiModel,
        prompt,
        schema
    })
    return parsed
}
