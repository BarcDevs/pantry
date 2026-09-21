import {
    httpUrlSchema,
    quantitySchema,
    recipeDocSchema
} from './recipe-doc-schema'

describe('quantitySchema', () => {
    it('accepts a plain number', () => {
        expect(quantitySchema.parse(2.5)).toBe(2.5)
    })

    it('accepts a range string', () => {
        expect(quantitySchema.parse('8-10')).toBe('8-10')
    })

    it('coerces a plain numeric string to a number', () => {
        expect(quantitySchema.parse('10')).toBe(10)
    })

    it('rejects a non-numeric, non-range string', () => {
        expect(() => quantitySchema.parse('a lot')).toThrow()
    })
})

const baseRecipeDoc = {
    userId: 'user_1',
    title: 'x',
    source: 'imported_url',
    difficulty: 'easy',
    maxTime: 30,
    mealCount: 2,
    mealType: 'dinner',
    ingredients: [],
    steps: [],
    rating: null,
    history: [],
    isFavorite: false,
    tags: [],
    aiPromptContext: null
}

describe('recipeDocSchema sourceName', () => {
    it('is optional', () => {
        expect(recipeDocSchema.parse(baseRecipeDoc).sourceName).toBeUndefined()
    })

    it('is trimmed', () => {
        expect(recipeDocSchema.parse({
            ...baseRecipeDoc,
            sourceName: '  Site  '
        }).sourceName).toBe('Site')
    })

    it('rejects more than 100 characters', () => {
        expect(() => recipeDocSchema.parse({
            ...baseRecipeDoc,
            sourceName: 'a'.repeat(101)
        })).toThrow()
    })

    it('still validates http urls', () => {
        expect(() => httpUrlSchema.parse('ftp://x.com')).toThrow()
    })
})
