/**
 * @jest-environment node
 */
jest.mock('@/lib/ai/gemini', () => ({
    generateStructured: jest.fn()
}))
jest.mock('@/models/pantry-item.model', () => ({
    PantryItemModel: {
        find: jest.fn()
    }
}))
jest.mock('@/lib/recipes/find-web-recipe', () => ({
    findWebRecipe: jest.fn()
}))
jest.mock('@/lib/search/create-search-client', () => ({
    createSearchClient: jest.fn()
}))
jest.mock('@/lib/search/compose-english-search-query', () => ({
    composeEnglishSearchQuery: jest.fn()
}))
jest.mock('../generate-recipe', () => ({
    generateRecipe: jest.fn()
}))

import {
    CookingUnit,
    FoodType
} from '@/types/enums'

import { generateStructured } from '@/lib/ai/gemini'
import { auth } from '@/lib/auth'
import { findWebRecipe } from '@/lib/recipes/find-web-recipe'
import { composeEnglishSearchQuery } from '@/lib/search/compose-english-search-query'
import { createSearchClient } from '@/lib/search/create-search-client'

import { PantryItemModel } from '@/models/pantry-item.model'

import { generateRecipe } from '../generate-recipe'
import { refineRecipe } from '../refine-recipe'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockGenerateStructured = generateStructured as jest.Mock
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
            label: 'עגבניה',
            category: FoodType.Vegetables,
            quantity: 2,
            unit: 'units',
            optional: false
        },
        {
            label: 'צ׳ילי',
            category: FoodType.Vegetables,
            quantity: 1,
            unit: 'units',
            optional: false
        }
    ],
    steps: [{ order: 1, description: 'לבשל פסטה עם צ׳ילי' }]
}

const pantryItems = [
    {
        name: 'עגבניה',
        type: FoodType.Vegetables,
        quantity: 3,
        unit: 'units'
    }
]

describe('refineRecipe', () => {
    beforeEach(() => jest.clearAllMocks())

    it('throws when unauthenticated', async () => {
        mockAuth.mockResolvedValue(null as never)
        await expect(refineRecipe({
            recipe,
            instruction: 'תוסיף חריפות'
        })).rejects.toThrow()
        expect(mockGenerateStructured).not.toHaveBeenCalled()
    })

    it('sends the recipe and instruction to the AI and returns the refined recipe with pantry status resolved', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockGenerateStructured.mockResolvedValue(refinedResponse)
        mockFind.mockReturnValue(leanChain(pantryItems))

        const result = await refineRecipe({
            recipe,
            instruction: 'תוסיף חריפות'
        })

        expect(mockGenerateStructured).toHaveBeenCalledWith(
            expect.stringContaining('תוסיף חריפות'),
            expect.anything(),
            expect.any(Function)
        )
        const [prompt] = mockGenerateStructured.mock.calls[0]
        expect(prompt).toContain('פסטה עגבניות')

        expect(result.title).toBe(refinedResponse.title)
        expect(result.ingredients).toHaveLength(2)
        expect(result.ingredients[0].name).toBe('עגבניה')
        expect(result.ingredients[0].inPantry).toBe(true)
        expect(result.ingredients[1].name).toBe('צ׳ילי')
        expect(result.ingredients[1].inPantry).toBe(false)
        expect(result.userId).toBe('user_123')
        expect(result.maxTime).toBe(recipe.maxTime)
        expect(result.mealCount).toBe(recipe.mealCount)
        expect(result.mealType).toBe(recipe.mealType)
        expect(result.source).toBe(recipe.source)
    })

    it('never searches the web or regenerates: only the single refine AI call runs', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockGenerateStructured.mockResolvedValue(refinedResponse)
        mockFind.mockReturnValue(leanChain(pantryItems))

        await refineRecipe({
            recipe,
            instruction: 'תוסיף חריפות'
        })

        expect(mockGenerateStructured).toHaveBeenCalledTimes(1)
        expect(findWebRecipe).not.toHaveBeenCalled()
        expect(createSearchClient).not.toHaveBeenCalled()
        expect(composeEnglishSearchQuery).not.toHaveBeenCalled()
        expect(generateRecipe).not.toHaveBeenCalled()
    })

    it('carries the previous image url over to the refined recipe', async () => {
        const imageUrl = 'https://example.com/pasta.jpg'
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockGenerateStructured.mockResolvedValue(refinedResponse)
        mockFind.mockReturnValue(leanChain(pantryItems))

        const result = await refineRecipe({
            recipe: {
                ...recipe,
                imageUrl
            },
            instruction: 'תוסיף חריפות'
        })

        expect(result.imageUrl).toBe(imageUrl)
    })

    it('rejects refining a recipe owned by another user', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_456' } } as never)
        await expect(refineRecipe({
            recipe,
            instruction: 'תוסיף חריפות'
        })).rejects.toThrow()
        expect(mockGenerateStructured).not.toHaveBeenCalled()
    })

    it('keeps the source url and name on the refined recipe', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockGenerateStructured.mockResolvedValue(refinedResponse)
        mockFind.mockReturnValue(leanChain(pantryItems))

        const result = await refineRecipe({
            recipe: {
                ...recipe,
                source: 'imported_url' as const,
                sourceUrl: 'https://a.co.il/r',
                sourceName: 'a.co.il'
            },
            instruction: 'תוסיף חריפות'
        })

        expect(result.sourceUrl).toBe('https://a.co.il/r')
        expect(result.sourceName).toBe('a.co.il')
    })
})
