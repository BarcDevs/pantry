import type { RecipeDoc } from '@/types/recipe'

import type { ImportedRecipe } from '@/lib/recipes/imported-recipe-schema'

export const buildImportedRecipeDoc = (
    userId: string,
    generated: ImportedRecipe,
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
    ingredients: generated.ingredients.map(
        (ingredient) => ({
            ...ingredient,
            inPantry: false
        })
    ),
    steps: generated.steps,
    emoji: generated.emoji,
    imageUrl: extras.imageUrl,
    rating: null,
    history: [],
    isFavorite: false,
    tags: [],
    aiPromptContext: null
})
