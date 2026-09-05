import { CookingUnit } from '@/types/enums'

import {
    normalizeFractionWords,
    normalizeIngredientFractions,
    normalizeStepFractions
} from './normalize-fraction-words'

describe('normalizeFractionWords', () => {
    it('replaces standalone 1/2 with חצי', () => {
        expect(normalizeFractionWords('הוסיפו 1/2 כוס מים')).toBe('הוסיפו חצי כוס מים')
    })

    it('replaces standalone 1/4 with רבע', () => {
        expect(normalizeFractionWords('1/4 כפית מלח')).toBe('רבע כפית מלח')
    })

    it('replaces bare decimal 0.5 and 0.25 even after a hyphen prefix', () => {
        expect(normalizeFractionWords('0.5 כוס ו-0.25 כפית')).toBe('חצי כוס ו-רבע כפית')
    })

    it('leaves other fractions untouched', () => {
        expect(normalizeFractionWords('3/4 כוס מים')).toBe('3/4 כוס מים')
    })
})

describe('normalizeStepFractions', () => {
    it('normalizes every step description', () => {
        const steps = [
            { order: 1, description: 'הוסיפו 1/2 כוס מים' },
            { order: 2, description: 'בשלו 10 דקות' }
        ]
        expect(normalizeStepFractions(steps)).toEqual([
            { order: 1, description: 'הוסיפו חצי כוס מים' },
            { order: 2, description: 'בשלו 10 דקות' }
        ])
    })
})

describe('normalizeIngredientFractions', () => {
    it('normalizes fractions embedded in an ingredient name', () => {
        const ingredients = [
            {
                name: '1/2 לימון',
                quantity: 1,
                unit: CookingUnit.Units,
                inPantry: false,
                optional: false
            },
            {
                name: 'עגבנייה',
                quantity: 2,
                unit: CookingUnit.Units,
                inPantry: false,
                optional: false
            }
        ]
        expect(normalizeIngredientFractions(ingredients)).toEqual([
            {
                name: 'חצי לימון',
                quantity: 1,
                unit: CookingUnit.Units,
                inPantry: false,
                optional: false
            },
            {
                name: 'עגבנייה',
                quantity: 2,
                unit: CookingUnit.Units,
                inPantry: false,
                optional: false
            }
        ])
    })
})
