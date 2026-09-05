import type { CookingUnit, PantryUnit } from '@/types/enums'

import {
    findMatchingPantryItem,
    hasEnoughPantryQuantity
} from '@/lib/recipes/check-pantry-sufficiency'

type MinimalIngredient = {
    name: string
    quantity: number | string
    unit: CookingUnit
}

export type MinimalPantryItem = {
    name: string
    quantity: number
    unit: PantryUnit
}

export const resolveIngredientPantryStatus = <T extends MinimalIngredient>(
    ingredients: T[],
    pantryItems: MinimalPantryItem[]
): Array<T & { inPantry: boolean }> => (
    ingredients.map((ingredient) => {
        const matchedItem = findMatchingPantryItem(ingredient.name, pantryItems)
        return {
            ...ingredient,
            inPantry: matchedItem !== undefined && hasEnoughPantryQuantity(
                ingredient.quantity,
                ingredient.unit,
                matchedItem.quantity,
                matchedItem.unit
            )
        }
    })
)
