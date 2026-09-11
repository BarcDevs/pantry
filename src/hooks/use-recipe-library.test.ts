import {
    act,
    renderHook
} from '@testing-library/react'

import {
    CookingUnit,
    FoodType
} from '@/types/enums'
import type { Recipe } from '@/types/recipe'

import { useRecipeLibrary } from './use-recipe-library'

jest.mock('@/actions/recipes/update-recipe', () => ({ updateRecipe: jest.fn() }))
jest.mock('@/actions/recipes/delete-recipe', () => ({ deleteRecipe: jest.fn() }))

const makeRecipe = (overrides: Partial<Recipe>): Recipe => ({
    _id: overrides._id ?? 'r1',
    userId: 'u1',
    title: overrides.title ?? 'מתכון',
    source: 'manual',
    difficulty: 'easy',
    maxTime: 30,
    mealCount: 2,
    mealType: 'dinner',
    ingredients: [],
    steps: [],
    rating: null,
    history: [],
    isFavorite: false,
    tags: [],
    aiPromptContext: null,
    ...overrides
} as Recipe)

describe('useRecipeLibrary can-cook filter', () => {
    it('ignores optional ingredients when deciding if a recipe is cookable', () => {
        const recipe = makeRecipe({
            ingredients: [
                {
                    label: 'עגבניות',
                    name: 'עגבניות',
                    category: FoodType.Vegetables,
                    quantity: 1,
                    unit: CookingUnit.Units,
                    inPantry: true,
                    optional: false
                },
                {
                    label: 'בזיליקום לקישוט',
                    name: 'בזיליקום',
                    category: FoodType.Vegetables,
                    quantity: 1,
                    unit: CookingUnit.Units,
                    inPantry: false,
                    optional: true
                }
            ]
        })
        const { result } = renderHook(() => useRecipeLibrary([recipe]))

        act(() => result.current.setFilter('can-cook'))

        expect(result.current.filteredRecipes).toHaveLength(1)
    })

    it('excludes a recipe missing a non-optional ingredient', () => {
        const recipe = makeRecipe({
            ingredients: [{
                label: 'עגבניות',
                name: 'עגבניות',
                category: FoodType.Vegetables,
                quantity: 1,
                unit: CookingUnit.Units,
                inPantry: false,
                optional: false
            }]
        })
        const { result } = renderHook(() => useRecipeLibrary([recipe]))

        act(() => result.current.setFilter('can-cook'))

        expect(result.current.filteredRecipes).toHaveLength(0)
    })
})
