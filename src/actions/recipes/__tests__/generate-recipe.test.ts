/**
 * @jest-environment node
 */
jest.mock('@/lib/auth', () => ({
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
jest.mock('@/models/user.model', () => ({
    UserModel: {
        findOne: jest.fn()
    }
}))
jest.mock('@/lib/ai/gemini', () => ({
    generateStructured: jest.fn()
}))

import {
    CookingUnit,
    FoodType
} from '@/types/enums'

import { generateStructured } from '@/lib/ai/gemini'
import { auth } from '@/lib/auth'

import { PantryItemModel } from '@/models/pantry-item.model'
import { UserModel } from '@/models/user.model'

import { generateRecipe } from '../generate-recipe'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockFind = PantryItemModel.find as jest.Mock
const mockFindOne = UserModel.findOne as jest.Mock
const mockGenerateStructured = generateStructured as jest.Mock

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
    beforeEach(() => jest.clearAllMocks())

    it('throws when unauthenticated', async () => {
        mockAuth.mockResolvedValue(null as never)
        await expect(generateRecipe(input)).rejects.toThrow()
        expect(mockGenerateStructured).not.toHaveBeenCalled()
    })

    it('assembles prompt from pantry context and returns recipe with round-tripped ai_prompt_context', async () => {
        mockAuth.mockResolvedValue({ user: { id: 'user_123' } } as never)
        mockFind.mockReturnValue(leanChain(pantryItems))
        mockFindOne.mockReturnValue(leanChain(null))
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
        mockFindOne.mockReturnValue(leanChain(null))
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
