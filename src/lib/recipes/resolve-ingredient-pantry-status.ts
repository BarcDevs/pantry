import type { CookingUnit, PantryUnit } from '@/types/enums'

import {
    findMatchingPantryItem,
    findRelatedPantryItem,
    hasEnoughPantryQuantity
} from '@/lib/recipes/check-pantry-sufficiency'

type MinimalIngredient = {
    name: string
    baseName: string
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
): Array<T & { inPantry: boolean, replacementName?: string }> => (
    ingredients.map((ingredient) => {
        const baseName = ingredient.baseName ?? ingredient.name
        const matchedItem = findMatchingPantryItem(baseName, pantryItems)
        const inPantry = matchedItem !== undefined && hasEnoughPantryQuantity(
            ingredient.quantity,
            ingredient.unit,
            matchedItem.quantity,
            matchedItem.unit
        )
        const replacementItem = !inPantry
            ? findRelatedPantryItem(baseName, pantryItems)
            : undefined

        return {
            ...ingredient,
            inPantry,
            replacementName: replacementItem?.name
        }
    })
)
