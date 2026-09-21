/**
 * @jest-environment node
 */
jest.mock('@/lib/ai/gemini', () => ({
    generateStructured: jest.fn()
}))

import {
    CookingUnit,
    FoodType
} from '@/types/enums'
import type { RecipeDoc } from '@/types/recipe'

import { generateStructured } from '@/lib/ai/gemini'

import { convertRecipeServings } from './convert-recipe-servings'

const mockGenerateStructured = generateStructured as jest.Mock

const recipe = {
    userId: 'user_1',
    title: 'פסטה',
    source: 'imported_url',
    sourceUrl: 'https://a.com/1',
    sourceName: 'a.com',
    difficulty: 'easy',
    maxTime: 20,
    mealCount: 4,
    mealType: 'dinner',
    ingredients: [{
        label: 'עגבניה',
        name: 'עגבניה',
        category: FoodType.Vegetables,
        quantity: 4,
        unit: CookingUnit.Units,
        inPantry: true,
        optional: false
    }],
    steps: [{
        order: 1,
        description: 'חתכו 4 עגבניות'
    }]
} as RecipeDoc

const pantryItems = [{
    name: 'עגבניה',
    type: FoodType.Vegetables,
    quantity: 3,
    unit: CookingUnit.Units
}]

describe('convertRecipeServings', () => {
    beforeEach(() => jest.clearAllMocks())

    it('rescales once without retries, re-resolves pantry status and keeps the rest', async () => {
        mockGenerateStructured.mockResolvedValue({
            title: 'ignored',
            difficulty: 'easy',
            emoji: '🍝',
            ingredients: [{
                label: 'עגבניה',
                category: FoodType.Vegetables,
                quantity: 2,
                unit: CookingUnit.Units,
                optional: false
            }],
            steps: [{
                order: 1,
                description: 'חתכו 2 עגבניות'
            }]
        })

        const result = await convertRecipeServings(
            recipe,
            2,
            pantryItems,
            8000
        )

        const call = mockGenerateStructured.mock.calls[0]
        expect(call[0]).toContain('2 מנות')
        expect(call[3]).toBe(0)
        expect(call[5]).toEqual({ timeoutMs: 8000 })
        expect(result.mealCount).toBe(2)
        expect(result.title).toBe('פסטה')
        expect(result.sourceUrl).toBe('https://a.com/1')
        expect(result.ingredients[0].quantity).toBe(2)
        expect(result.ingredients[0].inPantry).toBe(true)
        expect(result.steps[0].description).toBe('חתכו 2 עגבניות')
    })

    it('propagates AI failure so the caller can fall back', async () => {
        mockGenerateStructured.mockRejectedValue(new Error('timeout'))

        await expect(
            convertRecipeServings(recipe, 2, pantryItems, 8000)
        ).rejects.toThrow('timeout')
    })
})
