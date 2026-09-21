import { MatchStrictness } from '@/types/enums'
import type { RecipeDoc } from '@/types/recipe'

import { findMatchingPantryItem } from '@/lib/recipes/check-pantry-sufficiency'
import type { MinimalPantryItem } from '@/lib/recipes/resolve-ingredient-pantry-status'

type WebRecipeRequest = {
    maxTime: number
    matchStrictness: MatchStrictness
    customInstructions?: string
}

/**
 * An ingredient is missing when its name is not in the pantry at all. A
 * partial quantity (name matches, `inPantry` false only because the pantry
 * holds less than the recipe needs) counts as present. Water and other
 * always-available items already come back with `inPantry: true`.
 */
const isMissing = (
    ingredient: RecipeDoc['ingredients'][number],
    pantryItems: MinimalPantryItem[]
): boolean => (
    !ingredient.inPantry
    && findMatchingPantryItem(ingredient.name, pantryItems) === undefined
)

/**
 * Whether a recipe built from a web page qualifies for the request.
 * 1. Time: a stated total time above the requested max rejects; an unknown
 *    (missing / non-positive) time is accepted.
 * 2. Pantry match: strict = nothing missing (optional and side ingredients
 *    included); flexible = every non-optional (core) ingredient present,
 *    optional ones may be missing.
 * 3. Requested dish: when a dish was typed it is ALWAYS strict - the page
 *    recipe must be that dish (or a clear variant), i.e. `matchesRequestedDish`
 *    must be exactly true; false or missing rejects. Without a dish it is unused.
 */
export const judgeWebRecipe = (
    recipe: RecipeDoc,
    request: WebRecipeRequest,
    pantryItems: MinimalPantryItem[],
    matchesRequestedDish?: boolean
): boolean => {
    if (
        request.customInstructions?.trim()
        && matchesRequestedDish !== true
    ) return false

    const statedTime = recipe.maxTime
    if (
        Number.isFinite(statedTime)
        && statedTime > 0
        && statedTime > request.maxTime
    ) return false

    return recipe.ingredients
        .filter((ingredient) => (
            request.matchStrictness === MatchStrictness.Strict
            || !ingredient.optional
        ))
        .every((ingredient) => !isMissing(ingredient, pantryItems))
}
