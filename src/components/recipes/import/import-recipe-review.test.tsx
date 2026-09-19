import {
    fireEvent,
    render,
    screen
} from '@testing-library/react'

import type { RecipeDoc } from '@/types/recipe'

import { ImportRecipeReview } from './import-recipe-review'

jest.mock('@/components/recipes/result/recipe-result-hero', () => ({
    RecipeResultHero: () => null
}))
jest.mock('@/components/recipes/result/recipe-ingredients-list', () => ({
    RecipeIngredientsList: () => null
}))
jest.mock('@/components/recipes/result/recipe-draft-dismiss-button', () => ({
    RecipeDraftDismissButton: () => null
}))
jest.mock('@/components/recipes/result/recipe-refine-input', () => ({
    RecipeRefineInput: () => null
}))
jest.mock('@/components/recipes/result/recipe-steps-list', () => ({
    RecipeStepsList: () => null
}))

const recipe = {
    title: 'שקשוקה',
    ingredients: [],
    steps: []
} as unknown as RecipeDoc

const renderReview = (isSaving: boolean) => {
    const onSave = jest.fn()
    render(
        <ImportRecipeReview
            recipe={recipe}
            isSaving={isSaving}
            onTitleChange={jest.fn()}
            onSave={onSave}
            adjustments={{} as never}
            isRefining={false}
            onRefine={jest.fn()}
            onDismiss={jest.fn()}
        />
    )
    return onSave
}

describe('ImportRecipeReview Enter', () => {
    it('saves from the title field', () => {
        const onSave = renderReview(false)
        fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' })
        expect(onSave).toHaveBeenCalledTimes(1)
    })

    it('does not save while saving', () => {
        const onSave = renderReview(true)
        fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' })
        expect(onSave).not.toHaveBeenCalled()
    })
})
