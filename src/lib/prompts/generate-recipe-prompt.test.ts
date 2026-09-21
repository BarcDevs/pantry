import type { GenerateRecipeInput } from '@/types/recipe'

import { buildGenerateRecipePrompt } from './generate-recipe-prompt'

const request: GenerateRecipeInput = {
    mealCount: 2,
    maxTime: 30,
    mealType: 'dinner',
    scope: 'pantry-first',
    allowAiGeneration: true,
    matchStrictness: 'flexible'
}

describe('buildGenerateRecipePrompt', () => {
    it('states the requested dish', () => {
        const prompt = buildGenerateRecipePrompt(
            {
                ...request,
                customInstructions: 'לזניה'
            },
            ['פסטה'],
            {}
        )

        expect(prompt).toContain('המנה המבוקשת: לזניה')
        expect(prompt).not.toContain('הוראות מיוחדות')
    })

    it('has no requested dish line when none was given', () => {
        const prompt = buildGenerateRecipePrompt(request, ['פסטה'], {})

        expect(prompt).not.toContain('המנה המבוקשת')
    })
})
