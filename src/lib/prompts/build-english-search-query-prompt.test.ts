import type { GenerateRecipeInput } from '@/types/recipe'

import { buildEnglishSearchQueryPrompt } from './build-english-search-query-prompt'

const request: GenerateRecipeInput = {
    mealCount: 2,
    maxTime: 30,
    mealType: 'dinner',
    scope: 'pantry-first',
    allowAiGeneration: true,
    matchStrictness: 'flexible'
}

describe('buildEnglishSearchQueryPrompt', () => {
    it('includes the requested dish and asks for it to be translated', () => {
        const prompt = buildEnglishSearchQueryPrompt(
            {
                ...request,
                customInstructions: 'סופגניות'
            },
            ['קמח']
        )

        expect(prompt).toContain('Requested dish')
        expect(prompt).toContain('סופגניות')
        expect(prompt).toContain('קמח')
    })

    it('omits the dish line when no dish was requested', () => {
        const prompt = buildEnglishSearchQueryPrompt(request, ['קמח'])

        expect(prompt).not.toContain('Requested dish')
    })
})
