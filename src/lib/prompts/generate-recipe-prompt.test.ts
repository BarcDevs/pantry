import type { GenerateRecipeInput } from '@/types/recipe'

import { buildGenerateRecipePrompt } from './generate-recipe-prompt'

const request: GenerateRecipeInput = {
    mealCount: 2,
    maxTime: 30,
    mealType: 'dinner',
    scope: 'pantry-first',
    allowAiGeneration: true,
    matchStrictness: 'flexible',
    maxSpiceLevel: 3
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

    it('states the spice cap when below the max', () => {
        const prompt = buildGenerateRecipePrompt(
            { ...request, maxSpiceLevel: 1 },
            ['פסטה'],
            {}
        )

        expect(prompt).toContain('אסורה לעלות על 1')
    })

    it('has no spice cap line at the default max level', () => {
        const prompt = buildGenerateRecipePrompt(request, ['פסטה'], {})

        expect(prompt).not.toContain('אסורה לעלות על')
    })
})
