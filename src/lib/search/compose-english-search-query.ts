import type { GenerateRecipeInput } from '@/types/recipe'

import { generateStructured } from '@/lib/ai/gemini'
import { buildEnglishSearchQueryPrompt } from '@/lib/prompts/build-english-search-query-prompt'

import { englishSearchQuerySchema } from '@/schemas/english-search-query-schema'

export const composeEnglishSearchQuery = async (
    input: GenerateRecipeInput,
    ingredientNames: string[],
    timeoutMs: number
): Promise<string> => {
    const composed = await generateStructured(
        buildEnglishSearchQueryPrompt(input, ingredientNames),
        englishSearchQuerySchema,
        () => ({
            query: `${input.mealType} recipe ${ingredientNames.join(' ')}`.trim()
        }),
        0,
        undefined,
        { timeoutMs }
    )
    return composed.query
}
