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
jest.mock('node:dns/promises', () => ({
    lookup: jest.fn()
}))

import { lookup } from 'node:dns/promises'

import { auth } from '@clerk/nextjs/server'

import { FoodType } from '@/types/enums'

import { generateStructured } from '@/lib/ai/gemini'

import { PantryItemModel } from '@/models/pantry-item.model'

import { importRecipeFromUrl } from '../import-recipe-from-url'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockGenerateStructured = generateStructured as jest.Mock
const mockLookup = lookup as jest.Mock
const mockFind = PantryItemModel.find as jest.Mock
const mockFetch = jest.fn()

const aiRecipe = {
    title: 'פסטה ברוטב עגבניות',
    difficulty: 'easy',
    mealType: 'dinner',
    mealCount: 2,
    maxTime: 30,
    emoji: '🍝',
    ingredients: [
        {
            name: 'פסטה',
            baseName: 'פסטה',
            category: FoodType.Grains,
            quantity: 250,
            unit: 'g'
        }
    ],
    steps: [
        {
            order: 1,
            description: 'מבשלים פסטה'
        }
    ]
}

const encoder = new TextEncoder()

const makeResponse = (
    text: string,
    options: {
        status?: number
        contentType?: string
    } = {}
): unknown => {
    const status = options.status ?? 200
    const bytes = encoder.encode(text)
    let sent = false
    return {
        status,
        ok: status >= 200 && status < 300,
        headers: {
            get: (name: string) => {
                if (name === 'content-type') {
                    return options.contentType ?? 'text/html'
                }
                return null
            }
        },
        body: {
            getReader: () => ({
                read: async () => {
                    if (sent) return { done: true, value: undefined }
                    sent = true
                    return { done: false, value: bytes }
                },
                cancel: async () => undefined
            })
        }
    }
}

describe('importRecipeFromUrl', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = mockFetch as never
        mockLookup.mockResolvedValue([
            {
                address: '93.184.216.34',
                family: 4
            }
        ])
        mockFind.mockReturnValue({ lean: jest.fn().mockResolvedValue([]) })
    })

    it('throws when unauthenticated', async () => {
        mockAuth.mockResolvedValue({ userId: null } as never)
        await expect(
            importRecipeFromUrl('https://example.com/recipe')
        ).rejects.toThrow()
        expect(mockFetch).not.toHaveBeenCalled()
    })

    it(
        'returns a structured recipe with source imported_url and sourceUrl set',
        async () => {
            mockAuth.mockResolvedValue(
                { userId: 'user_123' } as never
            )
            mockFetch.mockResolvedValue(
                makeResponse(
                    '<html><body>פסטה ברוטב עגבניות</body></html>'
                )
            )
            mockGenerateStructured.mockResolvedValue(aiRecipe)

            const result = await importRecipeFromUrl(
                'https://example.com/recipe'
            )

            expect(result.fallbackToManual).toBe(false)
            expect(result.recipe?.source).toBe('imported_url')
            expect(result.recipe?.sourceUrl).toBe(
                'https://example.com/recipe'
            )
            expect(result.recipe?.title).toBe(aiRecipe.title)
            expect(result.recipe?.imageUrl).toBeUndefined()
        }
    )

    it(
        'flags an ingredient as in-pantry when it matches a pantry item with enough stock',
        async () => {
            mockAuth.mockResolvedValue(
                { userId: 'user_123' } as never
            )
            mockFetch.mockResolvedValue(
                makeResponse(
                    '<html><body>פסטה ברוטב עגבניות</body></html>'
                )
            )
            mockGenerateStructured.mockResolvedValue(aiRecipe)
            mockFind.mockReturnValue({
                lean: jest.fn().mockResolvedValue([
                    {
                        name: 'פסטה',
                        quantity: 500,
                        unit: 'g'
                    }
                ])
            })

            const result = await importRecipeFromUrl(
                'https://example.com/recipe'
            )

            expect(result.recipe?.ingredients[0].inPantry).toBe(true)
        }
    )

    it(
        'extracts og:image when present in the page html',
        async () => {
            mockAuth.mockResolvedValue(
                { userId: 'user_123' } as never
            )
            mockFetch.mockResolvedValue(
                makeResponse(
                    '<html><head><meta property="og:image" content="https://example.com/pic.jpg"></head></html>'
                )
            )
            mockGenerateStructured.mockResolvedValue(aiRecipe)

            const result = await importRecipeFromUrl(
                'https://example.com/recipe'
            )

            expect(result.recipe?.imageUrl).toBe(
                'https://example.com/pic.jpg'
            )
        }
    )

    it('returns fallbackToManual on total fetch failure', async () => {
        mockAuth.mockResolvedValue({ userId: 'user_123' } as never)
        mockFetch.mockRejectedValue(new Error('network error'))

        const result = await importRecipeFromUrl(
            'https://example.com/recipe'
        )

        expect(result).toEqual({
            recipe: null,
            fallbackToManual: true
        })
        expect(mockGenerateStructured).not.toHaveBeenCalled()
    })

    it(
        'blocks SSRF-risky targets without calling fetch',
        async () => {
            mockAuth.mockResolvedValue(
                { userId: 'user_123' } as never
            )
            mockLookup.mockResolvedValue([
                {
                    address: '169.254.169.254',
                    family: 4
                }
            ])

            const result = await importRecipeFromUrl(
                'http://169.254.169.254/latest/meta-data/'
            )

            expect(result).toEqual({
                recipe: null,
                fallbackToManual: true
            })
            expect(mockFetch).not.toHaveBeenCalled()
        }
    )
})
