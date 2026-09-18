import {
    CookingUnit,
    Difficulty,
    FoodType,
    MealType
} from '@/types/enums'

import type { ImportedRecipe } from '@/lib/recipes/imported-recipe-schema'

export const importedRecipeFallback = (): ImportedRecipe => ({
    title: 'מתכון לדוגמה',
    difficulty: Difficulty.Easy,
    mealType: MealType.Dinner,
    mealCount: 2,
    maxTime: 30,
    emoji: '🍽️',
    ingredients: [
        {
            label: 'פסטה',
            category: FoodType.Grains,
            quantity: 250,
            unit: CookingUnit.G,
            optional: false
        }
    ],
    steps: [
        {
            order: 1,
            description: 'מבשלים את הפסטה'
        }
    ]
})
