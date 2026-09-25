import {
    fireEvent,
    render,
    screen
} from '@testing-library/react'

import type { Recipe } from '@/types/recipe'

import { recipesTexts } from '@/constants/texts/recipes'

import { RecipeDetailView } from './recipe-detail-view'

const mockUpdateImageUrl = jest.fn()

jest.mock('@/actions/recipes/search-recipe-image', () => ({
    searchRecipeImage: jest.fn()
}))
jest.mock('@/hooks/use-recipe-detail', () => ({
    useRecipeDetail: (recipe: Recipe) => ({
        recipe,
        actions: { updateImageUrl: mockUpdateImageUrl },
        deletion: {}
    })
}))
jest.mock('@/hooks/use-recipe-branch', () => ({
    useRecipeBranch: () => ({
        adjustments: {
            values: {},
            actions: {},
            setField: jest.fn()
        }
    })
}))
jest.mock('@/components/shared/PageHeader', () => ({
    PageHeader: () => null
}))
jest.mock('@/components/recipes/result/recipe-result-hero', () => ({
    RecipeResultHero: () => null
}))
jest.mock('@/components/recipes/result/recipe-result-stats', () => ({
    RecipeResultStats: () => null
}))
jest.mock('@/components/recipes/result/recipe-ingredients-list', () => ({
    RecipeIngredientsList: () => null
}))
jest.mock('@/components/recipes/result/recipe-steps-list', () => ({
    RecipeStepsList: () => null
}))
jest.mock('@/components/recipes/result/recipe-refine-input', () => ({
    RecipeRefineInput: () => null
}))
jest.mock('@/components/recipes/detail/recipe-rating-display', () => ({
    RecipeRatingDisplay: () => null
}))
jest.mock('@/components/recipes/detail/recipe-tags-editor', () => ({
    RecipeTagsEditor: () => null
}))
jest.mock('@/components/recipes/detail/recipe-detail-actions', () => ({
    RecipeDetailActions: () => null
}))
jest.mock('@/components/recipes/shared/delete-recipe-dialog', () => ({
    DeleteRecipeDialog: () => null
}))

const importedRecipe = {
    _id: 'r1',
    title: 'עוגה',
    source: 'imported_url',
    imageUrl: 'https://example.com/og.jpg',
    history: [],
    ingredients: [],
    steps: []
} as unknown as Recipe

describe('RecipeDetailView image field', () => {
    it('lets the user remove the auto image of a URL-imported recipe', () => {
        render(<RecipeDetailView recipe={importedRecipe}/>)
        fireEvent.click(screen.getByText(recipesTexts.result.removeImage))
        expect(mockUpdateImageUrl).toHaveBeenCalledWith('')
    })
})
