import { generateObject } from 'ai'
import { type ZodType } from 'zod'

import type { ImageInput } from '@/types/receipt'

import { aiModel } from '@/config/ai'
import env from '@/config/env'

export const generateStructured = async <T>(
    prompt: string,
    schema: ZodType<T>,
    mock?: () => T,
    maxRetries?: number,
    image?: ImageInput
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
        schema,
        maxRetries,
        ...(image
            ? {
                messages: [{
                    role: 'user' as const,
                    content: [
                        {
                            type: 'text' as const,
                            text: prompt
                        },
                        {
                            type: 'image' as const,
                            image: image.base64,
                            mediaType: image.mimeType
                        }
                    ]
                }]
            }
            : { prompt })
    })
    return parsed
}
