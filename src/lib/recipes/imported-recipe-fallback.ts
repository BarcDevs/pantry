import { Difficulty, MealType } from '@/types/enums'

import type { ImportedRecipe } from '@/lib/recipes/imported-recipe-schema'

export const importedRecipeFallback = (): ImportedRecipe => ({
    title: 'מתכון לדוגמה',
    difficulty: Difficulty.Easy,
    mealType: MealType.Dinner,
    mealCount: 2,
    maxTime: 30,
    emoji: '🍽️',
    ingredients: [],
    steps: []
})
