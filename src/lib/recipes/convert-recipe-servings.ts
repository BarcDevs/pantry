import type { RecipeDoc } from '@/types/recipe'

import { generateStructured } from '@/lib/ai/gemini'
import { buildConvertServingsInstruction } from '@/lib/prompts/convert-servings-instruction'
import { buildRefineRecipePrompt } from '@/lib/prompts/refine-recipe-prompt'
import {
    normalizeIngredientFractions,
    normalizeStepFractions
} from '@/lib/recipes/normalize-fraction-words'
import type { MinimalPantryItem } from '@/lib/recipes/resolve-ingredient-pantry-status'
import { resolveIngredientPantryStatus } from '@/lib/recipes/resolve-ingredient-pantry-status'

import { aiRecipeSchema } from '@/schemas/ai-recipe-schema'

/**
 * One AI call (no retries) that rescales ingredient quantities and step
 * amounts to `mealCount` servings, then re-resolves pantry statuses since
 * the quantities changed. Everything else on the recipe is kept. Throws on
 * AI failure or timeout - the caller decides the fallback.
 */
export const convertRecipeServings = async (
    recipe: RecipeDoc,
    mealCount: number,
    pantryItems: MinimalPantryItem[],
    timeoutMs: number
): Promise<RecipeDoc> => {
    const converted = await generateStructured(
        buildRefineRecipePrompt(
            recipe,
            buildConvertServingsInstruction(mealCount)
        ),
        aiRecipeSchema,
        () => ({
            title: recipe.title,
            difficulty: recipe.difficulty,
            emoji: recipe.emoji ?? '🍳',
            ingredients: recipe.ingredients,
            steps: recipe.steps
        }),
        0,
        undefined,
        { timeoutMs }
    )

    return {
        ...recipe,
        mealCount,
        ingredients: resolveIngredientPantryStatus(
            normalizeIngredientFractions(converted.ingredients),
            pantryItems
        ),
        steps: normalizeStepFractions(converted.steps)
    }
}
