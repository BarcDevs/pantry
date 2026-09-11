import {
    findMatchingPantryItem,
    hasEnoughPantryQuantity
} from './check-pantry-sufficiency'

describe('findMatchingPantryItem', () => {
    it('matches an exact name', () => {
        const items = [{ name: 'פפריקה' }]
        expect(findMatchingPantryItem('פפריקה', items)).toBe(items[0])
    })

    it('matches ignoring case and surrounding whitespace', () => {
        const items = [{ name: ' Milk ' }]
        expect(findMatchingPantryItem('milk', items)).toBe(items[0])
    })

    it('does not match a specific variant against a different base item (soy milk vs milk)', () => {
        const items = [{ name: 'חלב סויה' }]
        expect(findMatchingPantryItem('חלב', items)).toBeUndefined()
    })

    it('matches a pantry item against a recipe ingredient with a prep-state addition (onion vs chopped onion)', () => {
        const items = [{ name: 'בצל' }]
        expect(findMatchingPantryItem('בצל קצוץ', items)).toBe(items[0])
    })

    it('does not match when the pantry item is a more specific variant', () => {
        const items = [{ name: 'פפריקה מתוקה טחונה' }]
        expect(findMatchingPantryItem('פפריקה', items)).toBeUndefined()
    })

    it('returns undefined when nothing matches', () => {
        const items = [{ name: 'מלח' }]
        expect(findMatchingPantryItem('סוכר', items)).toBeUndefined()
    })
})

describe('hasEnoughPantryQuantity', () => {
    it('compares directly when units match exactly', () => {
        expect(hasEnoughPantryQuantity(6, 'units', 3, 'units')).toBe(false)
        expect(hasEnoughPantryQuantity(3, 'units', 6, 'units')).toBe(true)
    })

    it('converts within the weight family (kg vs g)', () => {
        expect(hasEnoughPantryQuantity(500, 'g', 1, 'kg')).toBe(true)
        expect(hasEnoughPantryQuantity(2, 'kg', 500, 'g')).toBe(false)
    })

    it('converts within the volume family (L vs ml)', () => {
        expect(hasEnoughPantryQuantity(250, 'ml', 1, 'L')).toBe(true)
    })

    it('cannot verify across incompatible unit families, so assumes sufficient', () => {
        expect(hasEnoughPantryQuantity(1, 'tsp', 200, 'g')).toBe(true)
    })

    it('supports range quantities by using the upper bound', () => {
        expect(hasEnoughPantryQuantity('8-10', 'units', 9, 'units')).toBe(false)
        expect(hasEnoughPantryQuantity('8-10', 'units', 10, 'units')).toBe(true)
    })
})
