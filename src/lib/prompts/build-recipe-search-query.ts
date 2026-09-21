import type { MealType } from '@/types/enums'

import type { MinimalPantryItem } from '@/lib/recipes/resolve-ingredient-pantry-status'
import { selectSearchIngredients } from '@/lib/search/select-search-ingredients'

import { recipesTexts } from '@/constants/texts/recipes'

/**
 * Hebrew web-search query: `מתכון` + the requested dish (when given) + the
 * Hebrew meal-type label + up to 4 main ingredient names (meat/fish/eggs/
 * vegetables/dairy/grains first, staples and spices last - see
 * `selectSearchIngredients`). The dish and the selected products both steer
 * the search. Pure and deterministic.
 */
export const buildRecipeSearchQuery = (
    mealType: MealType,
    pantryItems: MinimalPantryItem[],
    dish?: string
): string => [
    'מתכון',
    dish,
    recipesTexts.generate.mealTypeOptions[mealType],
    ...selectSearchIngredients(pantryItems)
]
    .filter(Boolean)
    .join(' ')
