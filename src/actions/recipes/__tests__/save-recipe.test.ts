/**
 * @jest-environment node
 */
jest.mock('@/models/recipe.model', () => ({
    RecipeModel: {
        create: jest.fn()
    }
}))

import {
    CookingUnit,
    FoodType
} from '@/types/enums'

import { auth } from '@/lib/auth'

import { RecipeModel } from '@/models/recipe.model'

import { saveRecipe } from '../save-recipe'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockCreate = RecipeModel.create as jest.Mock

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
            label: 'עגבניה',
            name: 'עגבניה',
            category: FoodType.Vegetables,
            quantity: 2,
            unit: CookingUnit.Units,
            inPantry: true,
            optional: false
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

describe('saveRecipe', () => {
    beforeEach(() => jest.clearAllMocks())

    it('throws when unauthenticated', async () => {
        mockAuth.mockResolvedValue(null as never)
        await expect(saveRecipe(recipe)).rejects.toThrow()
        expect(mockCreate).not.toHaveBeenCalled()
    })

    it('stamps the recipe with the authenticated userId, ignoring the client-supplied one', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_456' } } as never)
        mockCreate.mockResolvedValue({
            toObject: () => ({
                ...recipe,
                userId: 'user_456',
                _id: { toString: () => 'recipe_1' }
            })
        })

        await saveRecipe(recipe)

        expect(mockCreate).toHaveBeenCalledWith(
            expect.objectContaining({ userId: 'user_456' })
        )
    })

    it('persists the recipe scoped to the current user', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockCreate.mockResolvedValue({
            toObject: () => ({
                ...recipe,
                _id: { toString: () => 'recipe_1' }
            })
        })

        const result = await saveRecipe(recipe)

        expect(result._id).toBe('recipe_1')
        expect(result.title).toBe(recipe.title)
        expect(mockCreate).toHaveBeenCalledWith(
            expect.objectContaining({ userId: 'user_123' })
        )
    })
})
