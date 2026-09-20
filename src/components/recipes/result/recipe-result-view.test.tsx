import {
    fireEvent,
    render,
    screen
} from '@testing-library/react'

import { recipesTexts } from '@/constants/texts/recipes'

import { RecipeResultView } from './recipe-result-view'

const mockSetManualImageUrl = jest.fn()

jest.mock('@/hooks/use-recipe-result', () => ({
    useRecipeResult: () => ({
        recipe: {
            title: 'עוגה',
            source: 'imported_url',
            imageUrl: 'https://example.com/og.jpg',
            ingredients: [],
            steps: []
        },
        adjustments: {
            values: {},
            actions: {},
            setField: jest.fn()
        },
        status: {
            isRefining: false,
            isSaving: false,
            savedRecipeId: null
        },
        actions: { setManualImageUrl: mockSetManualImageUrl }
    })
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
jest.mock('@/components/recipes/result/recipe-result-actions', () => ({
    RecipeResultActions: () => null
}))
jest.mock('@/components/recipes/result/recipe-draft-dismiss-button', () => ({
    RecipeDraftDismissButton: () => null
}))

describe('RecipeResultView image field', () => {
    it('lets the user remove the auto image of a URL-imported recipe', () => {
        render(<RecipeResultView/>)
        fireEvent.click(screen.getByText(recipesTexts.result.removeImage))
        expect(mockSetManualImageUrl).toHaveBeenCalledWith('')
    })
})
