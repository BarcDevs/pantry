import type { CookingUnit, PantryUnit } from '@/types/enums'

import { resolveQuantityNumber } from '@/lib/recipes/resolve-quantity-number'

type UnitFamily = 'weight' | 'volume' | 'other'

const WEIGHT_TO_GRAMS: Partial<Record<CookingUnit | PantryUnit, number>> = {
    kg: 1000,
    g: 1
}

const VOLUME_TO_ML: Partial<Record<CookingUnit | PantryUnit, number>> = {
    L: 1000,
    ml: 1
}

const toBaseAmount = (
    quantity: number,
    unit: CookingUnit | PantryUnit
): { family: UnitFamily, amount: number } => {
    if (unit in WEIGHT_TO_GRAMS) return { family: 'weight', amount: quantity * WEIGHT_TO_GRAMS[unit]! }
    if (unit in VOLUME_TO_ML) return { family: 'volume', amount: quantity * VOLUME_TO_ML[unit]! }
    return { family: 'other', amount: quantity }
}

export const findMatchingPantryItem = <T extends { name: string }>(
    ingredientName: string,
    pantryItems: T[]
): T | undefined => {
    const normalized = ingredientName.trim()
    return pantryItems.find((item) => {
        const itemName = item.name.trim()
        return itemName === normalized
            || normalized.includes(itemName)
            || itemName.includes(normalized)
    })
}

export const hasEnoughPantryQuantity = (
    ingredientQuantity: number | string,
    ingredientUnit: CookingUnit,
    pantryQuantity: number,
    pantryUnit: PantryUnit
): boolean => {
    const neededQuantity = resolveQuantityNumber(ingredientQuantity)

    if (ingredientUnit === pantryUnit) {
        return pantryQuantity >= neededQuantity
    }

    const needed = toBaseAmount(neededQuantity, ingredientUnit)
    const available = toBaseAmount(pantryQuantity, pantryUnit)

    if (needed.family === 'other' || needed.family !== available.family) {
        return true
    }

    return available.amount >= needed.amount
}
