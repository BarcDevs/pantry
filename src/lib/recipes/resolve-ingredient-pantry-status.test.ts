import {
    CookingUnit,
    FoodType,
    PantryUnit
} from '@/types/enums'

import { resolveIngredientPantryStatus } from './resolve-ingredient-pantry-status'

describe('resolveIngredientPantryStatus', () => {
    it('marks an ingredient in-pantry when its derived name matches a pantry item with enough quantity', () => {
        const [result] = resolveIngredientPantryStatus(
            [{
                label: 'בצל קצוץ',
                category: FoodType.Vegetables,
                quantity: 1,
                unit: CookingUnit.Units
            }],
            [{
                name: 'בצל',
                type: FoodType.Vegetables,
                quantity: 3,
                unit: PantryUnit.Units
            }]
        )

        expect(result.name).toBe('בצל')
        expect(result.inPantry).toBe(true)
        expect(result.replacementName).toBeUndefined()
    })

    it('marks a specific variant as missing with a replacement suggestion when only a related item exists in the same category', () => {
        const [result] = resolveIngredientPantryStatus(
            [{
                label: 'חלב סויה',
                category: FoodType.Dairy,
                quantity: 1,
                unit: CookingUnit.Units
            }],
            [{
                name: 'חלב',
                type: FoodType.Dairy,
                quantity: 1,
                unit: PantryUnit.Units
            }]
        )

        expect(result.inPantry).toBe(false)
        expect(result.replacementName).toBe('חלב')
    })

    it('does not suggest itself as a replacement when the same item exists but in insufficient quantity', () => {
        const [result] = resolveIngredientPantryStatus(
            [{
                label: 'פלפל אדום',
                category: FoodType.Vegetables,
                quantity: 5,
                unit: CookingUnit.Units
            }],
            [{
                name: 'פלפל אדום',
                type: FoodType.Vegetables,
                quantity: 1,
                unit: PantryUnit.Units
            }]
        )

        expect(result.inPantry).toBe(false)
        expect(result.replacementName).toBeUndefined()
    })

    it('does not cross categories when suggesting a replacement (red pepper/vegetables vs black pepper/condiments)', () => {
        const [result] = resolveIngredientPantryStatus(
            [{
                label: 'פלפל אדום',
                category: FoodType.Vegetables,
                quantity: 1,
                unit: CookingUnit.Units
            }],
            [{
                name: 'פלפל שחור',
                type: FoodType.Condiments,
                quantity: 1,
                unit: PantryUnit.Units
            }]
        )

        expect(result.inPantry).toBe(false)
        expect(result.replacementName).toBeUndefined()
    })

    it('still suggests a replacement for a legacy ingredient saved before the category field existed', () => {
        const [result] = resolveIngredientPantryStatus(
            [{
                label: 'פלפלים',
                quantity: 4,
                unit: CookingUnit.Units
            }],
            [{
                name: 'פלפל אדום',
                type: FoodType.Vegetables,
                quantity: 1,
                unit: PantryUnit.Kg
            }]
        )

        expect(result.inPantry).toBe(false)
        expect(result.replacementName).toBe('פלפל אדום')
    })

    it('marks an ingredient missing with no replacement when nothing relates', () => {
        const [result] = resolveIngredientPantryStatus(
            [{
                label: 'סוכר',
                category: FoodType.Condiments,
                quantity: 1,
                unit: CookingUnit.Cup
            }],
            [{
                name: 'מלח',
                type: FoodType.Condiments,
                quantity: 1,
                unit: PantryUnit.Kg
            }]
        )

        expect(result.inPantry).toBe(false)
        expect(result.replacementName).toBeUndefined()
    })

    it('derives the name from the legacy `name` field when `label` is absent', () => {
        const [result] = resolveIngredientPantryStatus(
            [{
                name: 'בצל קצוץ',
                quantity: 1,
                unit: CookingUnit.Units
            }],
            [{
                name: 'בצל',
                type: FoodType.Vegetables,
                quantity: 3,
                unit: PantryUnit.Units
            }]
        )

        expect(result.name).toBe('בצל')
        expect(result.inPantry).toBe(true)
    })
})
