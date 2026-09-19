import type {
    CookingUnit,
    FoodType,
    PantryUnit
} from '@/types/enums'

import { isAlwaysAvailableIngredient } from '@/lib/recipes/always-available-ingredients'
import {
    findMatchingPantryItem,
    findRelatedPantryItem,
    hasEnoughPantryQuantity
} from '@/lib/recipes/check-pantry-sufficiency'
import { deriveIngredientName } from '@/lib/recipes/derive-ingredient-name'

type MinimalIngredient = {
    label?: string
    /** Legacy documents (pre-label/name split) store display text here instead. */
    name?: string
    category?: FoodType
    quantity: number | string
    unit: CookingUnit
}

export type MinimalPantryItem = {
    name: string
    type: FoodType | null
    quantity: number
    unit: PantryUnit
}

export const resolveIngredientPantryStatus = <T extends MinimalIngredient>(
    ingredients: T[],
    pantryItems: MinimalPantryItem[]
): Array<T & {
    name: string
    inPantry: boolean
    replacementName?: string
}> => (
    ingredients.map((ingredient) => {
        // `name` is never trusted from storage or the AI - always re-derived live from the
        // display text, so pantry matching can't drift from a stale or bad stored value.
        const name = deriveIngredientName(ingredient.label ?? ingredient.name ?? '')
        const matchedItem = findMatchingPantryItem(name, pantryItems)
        const inPantry = isAlwaysAvailableIngredient(ingredient.label ?? ingredient.name ?? '')
            || (matchedItem !== undefined && hasEnoughPantryQuantity(
                ingredient.quantity,
                ingredient.unit,
                matchedItem.quantity,
                matchedItem.unit
            ))
        const replacementItem = !inPantry
            ? findRelatedPantryItem(
                name,
                ingredient.category,
                pantryItems
            )
            : undefined

        return {
            ...ingredient,
            name,
            inPantry,
            replacementName: replacementItem?.name
        }
    })
)
