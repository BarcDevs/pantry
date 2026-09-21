/**
 * @jest-environment node
 */
jest.mock('@/models/pantry-item.model', () => ({
    PantryItemModel: {
        find: jest.fn()
    }
}))
jest.mock('@/models/user.model', () => ({
    UserModel: {
        findById: jest.fn()
    }
}))
jest.mock('@/lib/ai/gemini', () => ({
    generateStructured: jest.fn()
}))
jest.mock('@/config/env', () => ({
    __esModule: true,
    default: { e2eMockAi: false }
}))
jest.mock('@/lib/search/create-search-client', () => ({
    createSearchClient: jest.fn()
}))
jest.mock('@/lib/recipes/find-web-recipe', () => ({
    findWebRecipe: jest.fn()
}))

import {
    CookingUnit,
    FoodType
} from '@/types/enums'

import { generateStructured } from '@/lib/ai/gemini'
import { auth } from '@/lib/auth'
import { findWebRecipe } from '@/lib/recipes/find-web-recipe'
import { createSearchClient } from '@/lib/search/create-search-client'

import env from '@/config/env'

import { PantryItemModel } from '@/models/pantry-item.model'
import { UserModel } from '@/models/user.model'

import { generateRecipe } from '../generate-recipe'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockFind = PantryItemModel.find as jest.Mock
const mockFindById = UserModel.findById as jest.Mock
const mockGenerateStructured = generateStructured as jest.Mock
const mockCreateSearchClient = createSearchClient as jest.Mock
const mockFindWebRecipe = findWebRecipe as jest.Mock
const mockEnv = env as { e2eMockAi: boolean }
const searchClient = { search: jest.fn() }

const leanChain = (result: unknown) => ({
    lean: jest.fn().mockResolvedValue(result)
})

const itemId1 = '507f1f77bcf86cd799439011'
const itemId2 = '507f1f77bcf86cd799439012'

const pantryItems = [
    {
        _id: itemId1,
        name: 'עגבניה',
        userId: 'user_123'
    },
    {
        _id: itemId2,
        name: 'בצל',
        userId: 'user_123'
    }
]

const aiResponse = {
    title: 'פסטה עגבניות',
    difficulty: 'easy',
    emoji: '🍝',
    ingredients: [
        {
            label: 'עגבניה',
            category: FoodType.Vegetables,
            quantity: 2,
            unit: CookingUnit.Units
        }
    ],
    steps: [{ order: 1, description: 'לבשל פסטה' }]
}

const input = {
    mealCount: 2,
    maxTime: 30,
    mealType: 'dinner' as const,
    scope: 'pantry-first' as const,
    allowAiGeneration: true,
    matchStrictness: 'flexible' as const,
    customInstructions: 'ללא גלוטן'
}

describe('generateRecipe', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockEnv.e2eMockAi = false
        mockCreateSearchClient.mockReturnValue(null)
    })

    it('throws when unauthenticated', async () => {
        mockAuth.mockResolvedValue(null as never)
        await expect(generateRecipe(input)).rejects.toThrow()
        expect(mockGenerateStructured).not.toHaveBeenCalled()
    })

    it('assembles prompt from pantry context and returns recipe with round-tripped ai_prompt_context', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockFind.mockReturnValue(leanChain(pantryItems))
        mockFindById.mockReturnValue(leanChain(null))
        mockGenerateStructured.mockResolvedValue(aiResponse)

        const result = await generateRecipe(input)

        expect(mockGenerateStructured).toHaveBeenCalledWith(
            expect.stringContaining('ללא גלוטן'),
            expect.anything(),
            expect.any(Function)
        )
        const [prompt] = mockGenerateStructured.mock.calls[0]
        expect(prompt).toContain('עגבניה')
        expect(prompt).toContain('בצל')
        expect(prompt).toContain('pantry-first')
        expect(prompt).toContain('flexible')

        expect(result.title).toBe(aiResponse.title)
        expect(result.userId).toBe('user_123')
        expect(result.source).toBe('ai_generated')
        expect(result.aiPromptContext).toEqual({
            mealCount: 2,
            maxTime: 30,
            mealType: 'dinner',
            scope: 'pantry-first',
            allowAiGeneration: true,
            matchStrictness: 'flexible',
            customInstructions: 'ללא גלוטן',
            pantrySnapshot: ['עגבניה', 'בצל']
        })
    })

    it('scopes pantry context to selectedItemIds when provided', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockFind.mockReturnValue(leanChain([pantryItems[0]]))
        mockFindById.mockReturnValue(leanChain(null))
        mockGenerateStructured.mockResolvedValue(aiResponse)

        await generateRecipe({
            ...input,
            selectedItemIds: [itemId1]
        })

        expect(mockFind).toHaveBeenCalledWith(
            expect.objectContaining({
                userId: 'user_123',
                _id: { $in: [itemId1] }
            })
        )
    })
})

describe('generateRecipe web-first sourcing', () => {
    const webRecipe = {
        userId: 'user_123',
        title: 'פלפלים ממולאים',
        source: 'imported_url',
        sourceUrl: 'https://a.co.il/canonical',
        sourceName: 'a.co.il',
        aiPromptContext: null
    }

    beforeEach(() => {
        jest.clearAllMocks()
        mockEnv.e2eMockAi = false
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockFind.mockReturnValue(leanChain(pantryItems))
        mockFindById.mockReturnValue(leanChain(null))
        mockGenerateStructured.mockResolvedValue(aiResponse)
        mockCreateSearchClient.mockReturnValue(searchClient)
    })

    it('returns the web recipe with the prompt context when the toggle is on and one is found', async () => {
        mockFindWebRecipe.mockResolvedValue(webRecipe)

        const result = await generateRecipe(input)

        expect(result.source).toBe('imported_url')
        expect(result.sourceUrl).toBe('https://a.co.il/canonical')
        expect(result.sourceName).toBe('a.co.il')
        expect(result.aiPromptContext).toEqual({
            mealCount: 2,
            maxTime: 30,
            mealType: 'dinner',
            scope: 'pantry-first',
            allowAiGeneration: true,
            matchStrictness: 'flexible',
            customInstructions: 'ללא גלוטן',
            pantrySnapshot: ['עגבניה', 'בצל']
        })
        expect(mockFindWebRecipe).toHaveBeenCalledWith(
            expect.objectContaining({ userId: 'user_123' }),
            { searchClient }
        )
        expect(mockGenerateStructured).not.toHaveBeenCalled()
    })

    it('falls back to AI generation when nothing is found on the web', async () => {
        mockFindWebRecipe.mockResolvedValue(null)

        const result = await generateRecipe(input)

        expect(result.source).toBe('ai_generated')
        expect(mockGenerateStructured).toHaveBeenCalledTimes(1)
    })

    it('falls back to AI generation when no search client is configured', async () => {
        mockCreateSearchClient.mockReturnValue(null)

        const result = await generateRecipe(input)

        expect(result.source).toBe('ai_generated')
        expect(mockFindWebRecipe).not.toHaveBeenCalled()
    })

    it('does not search when the toggle is off', async () => {
        const result = await generateRecipe({
            ...input,
            allowAiGeneration: false
        })

        expect(result.source).toBe('ai_generated')
        expect(mockCreateSearchClient).not.toHaveBeenCalled()
        expect(mockFindWebRecipe).not.toHaveBeenCalled()
    })

    it('never searches under E2E_MOCK_AI', async () => {
        mockEnv.e2eMockAi = true

        const result = await generateRecipe(input)

        expect(result.source).toBe('ai_generated')
        expect(mockFindWebRecipe).not.toHaveBeenCalled()
    })
})
