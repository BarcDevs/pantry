import type { MinimalPantryItem } from '@/lib/recipes/resolve-ingredient-pantry-status'

import {
    maxQueryIngredients,
    queryCategoryPriority
} from '@/constants/search'

const rankOf = (item: MinimalPantryItem): number => {
    const index = item.type === null
        ? -1
        : queryCategoryPriority.indexOf(item.type)
    return index === -1 ? queryCategoryPriority.length : index
}

/**
 * Up to `maxQueryIngredients` distinct pantry item names for a search query.
 * Deterministic rule: items are ranked by category priority (meat, fish,
 * eggs, vegetables, dairy, grains, then everything else such as condiments,
 * spices and oils); ties keep the pantry order; duplicate names are dropped.
 */
export const selectSearchIngredients = (
    pantryItems: MinimalPantryItem[]
): string[] => {
    const seen = new Set<string>()
    return pantryItems
        .map((item, index) => ({
            item,
            index
        }))
        .sort((a, b) => rankOf(a.item) - rankOf(b.item) || a.index - b.index)
        .map(({ item }) => item.name.trim())
        .filter((name) => {
            if (name === '' || seen.has(name)) return false
            seen.add(name)
            return true
        })
        .slice(0, maxQueryIngredients)
}
