import { formatQuantity } from './format-quantity'

describe('formatQuantity', () => {
    it('formats whole numbers as-is', () => {
        expect(formatQuantity(2)).toBe('2')
    })

    it('formats a bare fraction as a glyph', () => {
        expect(formatQuantity(0.5)).toBe('½')
        expect(formatQuantity(0.75)).toBe('¾')
        expect(formatQuantity(0.25)).toBe('¼')
        expect(formatQuantity(0.33)).toBe('⅓')
    })

    it('formats a whole number plus a fraction', () => {
        expect(formatQuantity(1.5)).toBe('1½')
        expect(formatQuantity(2.25)).toBe('2¼')
    })

    it('falls back to a rounded decimal when no fraction matches', () => {
        expect(formatQuantity(1.05)).toBe('1.05')
    })
})
