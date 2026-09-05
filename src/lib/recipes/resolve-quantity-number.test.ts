import { resolveQuantityNumber } from './resolve-quantity-number'

describe('resolveQuantityNumber', () => {
    it('returns a plain number as-is', () => {
        expect(resolveQuantityNumber(2.5)).toBe(2.5)
    })

    it('resolves a range string to its upper bound', () => {
        expect(resolveQuantityNumber('8-10')).toBe(10)
    })
})
