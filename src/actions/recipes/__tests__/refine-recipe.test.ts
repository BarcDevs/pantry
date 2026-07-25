/**
 * @jest-environment node
 */
jest.mock('@clerk/nextjs/server', () => ({
    auth: jest.fn()
}))
jest.mock('@/lib/ai/gemini', () => ({
    generateStructured: jest.fn()
}))

import { auth } from '@clerk/nextjs/server'

import { generateStructured } from '@/lib/ai/gemini'

import { refineRecipe } from '../refine-recipe'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockGenerateStructured = generateStructured as jest.Mock

const recipe = {
    userId: 'user_123',
    title: 'פסטה עגבניות',
    source: 'ai_generated' as const,
    difficulty: 'easy' as const,
    maxTime: 30,
    mealCount: 2,
    mealType: 'dinner' as const,
    ingredients: [
        {
            name: 'עגבניה',
            quantity: 2,
            unit: 'units' as const,
            inPantry: true
        }
    ],
    steps: [{ order: 1, description: 'לבשל פסטה' }],
    emoji: '🍝',
    rating: null,
    history: [],
    isFavorite: false,
    tags: [],
    aiPromptContext: null
}

const refinedResponse = {
    title: 'פסטה עגבניות חריפה',
    difficulty: 'easy',
    emoji: '🌶️',
    ingredients: [
        {
            name: 'עגבניה',
            quantity: 2,
            unit: 'units',
            inPantry: true
        },
        {
            name: 'צ׳ילי',
            quantity: 1,
            unit: 'units',
            inPantry: false
        }
    ],
    steps: [{ order: 1, description: 'לבשל פסטה עם צ׳ילי' }]
}

describe('refineRecipe', () => {
    beforeEach(() => jest.clearAllMocks())

    it('throws when unauthenticated', async () => {
        mockAuth.mockResolvedValue({ userId: null } as never)
        await expect(refineRecipe({
            recipe,
            instruction: 'תוסיף חריפות'
        })).rejects.toThrow()
        expect(mockGenerateStructured).not.toHaveBeenCalled()
    })

    it('sends the recipe and instruction to the AI and returns the refined recipe', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)
        mockGenerateStructured.mockResolvedValue(refinedResponse)

        const result = await refineRecipe({
            recipe,
            instruction: 'תוסיף חריפות'
        })

        expect(mockGenerateStructured).toHaveBeenCalledWith(
            expect.stringContaining('תוסיף חריפות'),
            expect.anything()
        )
        const [prompt] = mockGenerateStructured.mock.calls[0]
        expect(prompt).toContain('פסטה עגבניות')

        expect(result.title).toBe(refinedResponse.title)
        expect(result.ingredients).toHaveLength(2)
        expect(result.userId).toBe('user_123')
        expect(result.maxTime).toBe(recipe.maxTime)
        expect(result.mealCount).toBe(recipe.mealCount)
        expect(result.mealType).toBe(recipe.mealType)
        expect(result.source).toBe(recipe.source)
    })

    it('rejects refining a recipe owned by another user', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_456' } as never)
        await expect(refineRecipe({
            recipe,
            instruction: 'תוסיף חריפות'
        })).rejects.toThrow()
        expect(mockGenerateStructured).not.toHaveBeenCalled()
    })
})
