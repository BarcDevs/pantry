jest.mock('@/lib/ai/gemini', () => ({
    generateStructured: jest.fn()
}))

import { generateStructured } from '@/lib/ai/gemini'

import { buildRecipeFromPage } from './build-recipe-from-page'

const mockGenerateStructured = generateStructured as jest.Mock

const extracted = {
    title: 'קציצות',
    difficulty: 'easy',
    mealType: 'dinner',
    mealCount: 2,
    maxTime: 30,
    emoji: '🍽️',
    ingredients: [{
        label: 'בשר',
        category: 'meat',
        quantity: 1,
        unit: 'units',
        optional: false
    }],
    steps: [{
        order: 1,
        description: 'מבשלים'
    }]
}

const baseInput = {
    userId: 'u1',
    pageUrl: 'https://a.co.il/r',
    page: {
        pageText: 'text',
        html: '<html></html>'
    },
    pantryItems: []
}

describe('buildRecipeFromPage requested dish', () => {
    beforeEach(() => jest.clearAllMocks())

    it('puts the dish in the prompt, asks for the flag and returns it', async () => {
        mockGenerateStructured.mockResolvedValue({
            ...extracted,
            matchesRequestedDish: false
        })

        const result = await buildRecipeFromPage({
            ...baseInput,
            requestedDish: 'לזניה'
        })

        const [prompt, schema] = mockGenerateStructured.mock.calls[0]
        expect(prompt).toContain('matchesRequestedDish')
        expect(prompt).toContain('"לזניה"')
        expect(schema.safeParse({
            ...extracted,
            matchesRequestedDish: true
        }).data.matchesRequestedDish).toBe(true)
        expect(result).toEqual(expect.objectContaining({
            status: 'ok',
            matchesRequestedDish: false
        }))
    })

    it('leaves the flag undefined when the model omits it', async () => {
        mockGenerateStructured.mockResolvedValue(extracted)

        const result = await buildRecipeFromPage({
            ...baseInput,
            requestedDish: 'לזניה'
        })

        expect(result).toEqual(expect.objectContaining({ status: 'ok' }))
        expect(result).toHaveProperty('matchesRequestedDish', undefined)
    })

    it('does not mention a dish or the flag when none was requested', async () => {
        mockGenerateStructured.mockResolvedValue(extracted)

        await buildRecipeFromPage(baseInput)

        const [prompt, schema] = mockGenerateStructured.mock.calls[0]
        expect(prompt).not.toContain('matchesRequestedDish')
        expect(schema.safeParse({
            ...extracted,
            matchesRequestedDish: true
        }).data).not.toHaveProperty('matchesRequestedDish')
    })
})
