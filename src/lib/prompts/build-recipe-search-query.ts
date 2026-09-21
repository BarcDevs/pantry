import type { MealType } from '@/types/enums'

import type { MinimalPantryItem } from '@/lib/recipes/resolve-ingredient-pantry-status'
import { selectSearchIngredients } from '@/lib/search/select-search-ingredients'

import { recipesTexts } from '@/constants/texts/recipes'

/**
 * Hebrew web-search query. With a requested dish it is `מתכון <dish>` (the
 * dish alone drives the search). Without one: `מתכון` + the Hebrew meal-type
 * label + up to 4 main ingredient names (meat/fish/eggs/vegetables/dairy/
 * grains first, staples and spices last - see `selectSearchIngredients`).
 * Pure and deterministic.
 */
export const buildRecipeSearchQuery = (
    mealType: MealType,
    pantryItems: MinimalPantryItem[],
    dish?: string
): string => dish
    ? `מתכון ${dish}`
    : [
        'מתכון',
        recipesTexts.generate.mealTypeOptions[mealType],
        ...selectSearchIngredients(pantryItems)
    ].join(' ')
