/**
 * @jest-environment node
 */
jest.mock('@clerk/nextjs/server', () => ({
    auth: jest.fn()
}))
jest.mock('@/lib/mongodb', () => ({
    __esModule: true,
    default: jest.fn()
}))
jest.mock('@/models/pantry-item.model', () => ({
    PantryItemModel: {
        find: jest.fn()
    }
}))
jest.mock('@/lib/ai/gemini', () => ({
    generateStructured: jest.fn()
}))

import { auth } from '@clerk/nextjs/server'

import { generateStructured } from '@/lib/ai/gemini'

import { PantryItemModel } from '@/models/pantry-item.model'

import { importRecipeFromText } from '../import-recipe-from-text'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockGenerateStructured = generateStructured as jest.Mock
const mockFind = PantryItemModel.find as jest.Mock

const aiRecipe = {
    title: 'עוגת שוקולד',
    difficulty: 'medium',
    mealType: 'snack',
    mealCount: 8,
    maxTime: 60,
    emoji: '🍫',
    ingredients: [
        {
            name: 'קמח',
            quantity: 2,
            unit: 'units'
        }
    ],
    steps: [
        {
            order: 1,
            description: 'מערבבים את המרכיבים'
        }
    ]
}

describe('importRecipeFromText', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockFind.mockReturnValue({ lean: jest.fn().mockResolvedValue([]) })
    })

    it('throws when unauthenticated', async () => {
        mockAuth.mockResolvedValue({ userId: null } as never)
        await expect(
            importRecipeFromText('כמה קמח וסוכר...')
        ).rejects.toThrow()
    })

    it(
        'returns a recipe with source imported_url and no sourceUrl/imageUrl',
        async () => {
            mockAuth.mockResolvedValue(
                { userId: 'user_123' } as never
            )
            mockGenerateStructured.mockResolvedValue(aiRecipe)

            const result = await importRecipeFromText(
                'כמה קמח וסוכר...'
            )

            expect(result.fallbackToManual).toBe(false)
            expect(result.recipe?.source).toBe('imported_url')
            expect(result.recipe?.sourceUrl).toBeUndefined()
            expect(result.recipe?.imageUrl).toBeUndefined()
            expect(result.recipe?.title).toBe(aiRecipe.title)
        }
    )

    it('throws on empty text', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)
        await expect(importRecipeFromText('')).rejects.toThrow()
        expect(mockGenerateStructured).not.toHaveBeenCalled()
    })
})
