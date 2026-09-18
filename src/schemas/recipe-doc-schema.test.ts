import { quantitySchema } from './recipe-doc-schema'

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
