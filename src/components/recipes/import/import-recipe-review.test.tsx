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

jest.mock('@/components/recipes/result/recipe-image-url-field', () => ({
    RecipeImageUrlField: ({ imageUrl, onChange }: {
        imageUrl?: string
        onChange: (imageUrl: string) => void
    }) => (
        <button onClick={() => onChange('')}>
            {`image:${imageUrl}`}
        </button>
    )
}))

const recipe = {
    title: 'שקשוקה',
    ingredients: [],
    steps: []
} as unknown as RecipeDoc

const renderReview = (
    isSaving: boolean,
    onImageUrlChange = jest.fn()
) => {
    const onSave = jest.fn()
    render(
        <ImportRecipeReview
            recipe={recipe}
            isSaving={isSaving}
            onTitleChange={jest.fn()}
            onImageUrlChange={onImageUrlChange}
            onSave={onSave}
            adjustments={{
                values: {},
                actions: {}
            } as never}
            isRefining={false}
            onRefine={jest.fn()}
            onDismiss={jest.fn()}
        />
    )
    return onSave
}

describe('ImportRecipeReview image', () => {
    it('offers the image field and forwards changes', () => {
        const onImageUrlChange = jest.fn()
        renderReview(false, onImageUrlChange)
        fireEvent.click(screen.getByText('image:undefined'))
        expect(onImageUrlChange).toHaveBeenCalledWith('')
    })
})

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
