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
jest.mock('@/models/recipe.model', () => ({
    RecipeModel: {
        create: jest.fn()
    }
}))

import { auth } from '@clerk/nextjs/server'

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
            name: 'עגבניה',
            quantity: 2,
            unit: 'units' as const,
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
        mockAuth.mockResolvedValue({ userId: null } as never)
        await expect(saveRecipe(recipe)).rejects.toThrow()
        expect(mockCreate).not.toHaveBeenCalled()
    })

    it('stamps the recipe with the authenticated userId, ignoring the client-supplied one', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_456' } as never)
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
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)
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
