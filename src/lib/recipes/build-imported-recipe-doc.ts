import type { RecipeDoc } from '@/types/recipe'

import type { ImportedRecipe } from '@/lib/recipes/imported-recipe-schema'
import {
    normalizeIngredientFractions,
    normalizeStepFractions
} from '@/lib/recipes/normalize-fraction-words'
import type { MinimalPantryItem } from '@/lib/recipes/resolve-ingredient-pantry-status'
import { resolveIngredientPantryStatus } from '@/lib/recipes/resolve-ingredient-pantry-status'

export const buildImportedRecipeDoc = (
    userId: string,
    generated: ImportedRecipe,
    pantryItems: MinimalPantryItem[],
    extras: {
        sourceUrl?: string
        imageUrl?: string
    } = {}
): RecipeDoc => ({
    userId,
    title: generated.title,
    source: 'imported_url',
    sourceUrl: extras.sourceUrl,
    difficulty: generated.difficulty,
    maxTime: generated.maxTime,
    mealCount: generated.mealCount,
    mealType: generated.mealType,
    ingredients: resolveIngredientPantryStatus(
        normalizeIngredientFractions(generated.ingredients),
        pantryItems
    ),
    steps: normalizeStepFractions(generated.steps),
    emoji: generated.emoji,
    imageUrl: extras.imageUrl,
    rating: null,
    history: [],
    isFavorite: false,
    tags: [],
    aiPromptContext: null
})
