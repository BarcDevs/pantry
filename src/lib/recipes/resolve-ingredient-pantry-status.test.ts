import { FoodType } from '@/types/enums'

import { resolveIngredientPantryStatus } from './resolve-ingredient-pantry-status'

describe('resolveIngredientPantryStatus', () => {
    it('marks an ingredient in-pantry when its baseName matches a pantry item with enough quantity', () => {
        const [result] = resolveIngredientPantryStatus(
            [{
                name: 'בצל קצוץ',
                baseName: 'בצל',
                category: FoodType.Vegetables,
                quantity: 1,
                unit: 'units' as const
            }],
            [{
                name: 'בצל',
                type: FoodType.Vegetables,
                quantity: 3,
                unit: 'units' as const
            }]
        )

        expect(result.inPantry).toBe(true)
        expect(result.replacementName).toBeUndefined()
    })

    it('marks a specific variant as missing with a replacement suggestion when only a related item exists in the same category', () => {
        const [result] = resolveIngredientPantryStatus(
            [{
                name: 'חלב סויה',
                baseName: 'חלב סויה',
                category: FoodType.Dairy,
                quantity: 1,
                unit: 'units' as const
            }],
            [{
                name: 'חלב',
                type: FoodType.Dairy,
                quantity: 1,
                unit: 'units' as const
            }]
        )

        expect(result.inPantry).toBe(false)
        expect(result.replacementName).toBe('חלב')
    })

    it('does not suggest itself as a replacement when the same item exists but in insufficient quantity', () => {
        const [result] = resolveIngredientPantryStatus(
            [{
                name: 'פלפל אדום',
                baseName: 'פלפל אדום',
                category: FoodType.Vegetables,
                quantity: 5,
                unit: 'units' as const
            }],
            [{
                name: 'פלפל אדום',
                type: FoodType.Vegetables,
                quantity: 1,
                unit: 'units' as const
            }]
        )

        expect(result.inPantry).toBe(false)
        expect(result.replacementName).toBeUndefined()
    })

    it('does not cross categories when suggesting a replacement (red pepper/vegetables vs black pepper/condiments)', () => {
        const [result] = resolveIngredientPantryStatus(
            [{
                name: 'פלפל אדום',
                baseName: 'פלפל אדום',
                category: FoodType.Vegetables,
                quantity: 1,
                unit: 'units' as const
            }],
            [{
                name: 'פלפל שחור',
                type: FoodType.Condiments,
                quantity: 1,
                unit: 'units' as const
            }]
        )

        expect(result.inPantry).toBe(false)
        expect(result.replacementName).toBeUndefined()
    })

    it('marks an ingredient missing with no replacement when nothing relates', () => {
        const [result] = resolveIngredientPantryStatus(
            [{
                name: 'סוכר',
                baseName: 'סוכר',
                category: FoodType.Condiments,
                quantity: 1,
                unit: 'cup' as const
            }],
            [{
                name: 'מלח',
                type: FoodType.Condiments,
                quantity: 1,
                unit: 'kg' as const
            }]
        )

        expect(result.inPantry).toBe(false)
        expect(result.replacementName).toBeUndefined()
    })
})
