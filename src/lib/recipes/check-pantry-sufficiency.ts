import type {
    CookingUnit,
    FoodType,
    PantryUnit
} from '@/types/enums'

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

const PREP_MODIFIER_WORDS = new Set([
    'קצוץ', 'קצוצה', 'קצוצים', 'קצוצות',
    'פרוס', 'פרוסה', 'פרוסים', 'פרוסות',
    'טחון', 'טחונה', 'טחונים', 'טחונות',
    'מגורר', 'מגוררת', 'מגוררים', 'מגוררות',
    'קפוא', 'קפואה', 'קפואים', 'קפואות',
    'טרי', 'טריה', 'טריים', 'טריות',
    'חתוך', 'חתוכה', 'חתוכים', 'חתוכות',
    'מרוסק', 'מרוסקת', 'מרוסקים', 'מרוסקות',
    'שלם', 'שלמה', 'שלמים', 'שלמות',
    'יבש', 'יבשה', 'יבשים', 'יבשות',
    'חצוי', 'חצויה', 'חצויים', 'חצויות',
    'מבושל', 'מבושלת', 'מבושלים', 'מבושלות',
    'קלוף', 'קלופה', 'קלופים', 'קלופות'
])

const normalizeItemName = (name: string): string => (
    name
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => !PREP_MODIFIER_WORDS.has(word))
        .join(' ')
)

export const findMatchingPantryItem = <T extends { name: string }>(
    ingredientName: string,
    pantryItems: T[]
): T | undefined => {
    const normalized = normalizeItemName(ingredientName)
    return pantryItems.find((item) => normalizeItemName(item.name) === normalized)
}

const nameWords = (name: string): Set<string> => new Set(
    normalizeItemName(name).split(/\s+/).filter((word) => word.length > 1)
)

export const findRelatedPantryItem = <T extends { name: string, type: FoodType | null }>(
    ingredientName: string,
    ingredientCategory: FoodType,
    pantryItems: T[]
): T | undefined => {
    const normalizedIngredient = normalizeItemName(ingredientName)
    const ingredientWords = nameWords(ingredientName)

    return pantryItems.find((item) => {
        if (item.type !== ingredientCategory) return false
        if (normalizeItemName(item.name) === normalizedIngredient) return false

        const itemWords = nameWords(item.name)
        for (const word of ingredientWords) {
            if (itemWords.has(word)) return true
        }
        return false
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
