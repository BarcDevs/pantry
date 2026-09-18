/**
 * @jest-environment node
 */
jest.mock('@/models/recipe.model', () => ({
    RecipeModel: {
        create: jest.fn()
    }
}))
jest.mock('@/lib/ai/gemini', () => ({
    generateStructured: jest.fn()
}))
jest.mock('@/models/pantry-item.model', () => ({
    PantryItemModel: {
        find: jest.fn()
    }
}))

import {
    CookingUnit,
    FoodType
} from '@/types/enums'

import { generateStructured } from '@/lib/ai/gemini'
import { auth } from '@/lib/auth'

import { PantryItemModel } from '@/models/pantry-item.model'
import { RecipeModel } from '@/models/recipe.model'

import { branchRecipe } from '../branch-recipe'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockGenerateStructured = generateStructured as jest.Mock
const mockCreate = RecipeModel.create as jest.Mock
const mockFind = PantryItemModel.find as jest.Mock

const leanChain = (result: unknown) => ({
    lean: jest.fn().mockResolvedValue(result)
})

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
    rating: 5 as const,
    history: [{
        entryId: 'h1',
        cookedAt: new Date('2026-01-01'),
        rating: 5 as const
    }],
    isFavorite: true,
    tags: ['אהוב'],
    aiPromptContext: null
}

const refinedResponse = {
    title: 'פסטה עגבניות עם חלב סויה',
    difficulty: 'easy',
    emoji: '🍝',
    ingredients: recipe.ingredients,
    steps: recipe.steps
}

describe('branchRecipe', () => {
    beforeEach(() => jest.clearAllMocks())

    it('creates a new recipe from the refined result instead of updating the original', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockGenerateStructured.mockResolvedValue(refinedResponse)
        mockFind.mockReturnValue(leanChain([]))
        mockCreate.mockResolvedValue({
            toObject: () => ({
                ...recipe,
                title: refinedResponse.title,
                _id: { toString: () => 'branched_1' }
            })
        })

        const result = await branchRecipe(recipe, 'להשתמש בחלב סויה במקום חלב')

        expect(result._id).toBe('branched_1')
        expect(mockCreate).toHaveBeenCalledWith(
            expect.objectContaining({
                title: refinedResponse.title,
                userId: 'user_123'
            })
        )
    })

    it('resets rating, history, and favorite status on the branched recipe', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockGenerateStructured.mockResolvedValue(refinedResponse)
        mockFind.mockReturnValue(leanChain([]))
        mockCreate.mockResolvedValue({
            toObject: () => ({
                ...recipe,
                _id: { toString: () => 'branched_1' }
            })
        })

        await branchRecipe(recipe, 'להשתמש בחלב סויה במקום חלב')

        expect(mockCreate).toHaveBeenCalledWith(
            expect.objectContaining({
                rating: null,
                history: [],
                isFavorite: false
            })
        )
    })
})
