import {
    fireEvent,
    render,
    screen
} from '@testing-library/react'

import type { RecipeDoc } from '@/types/recipe'

import { recipesTexts } from '@/constants/texts/recipes'

import { RecipeResultActions } from './recipe-result-actions'

const texts = recipesTexts.result

const setup = (overrides: {
    isSaved?: boolean
    isSaving?: boolean
    isAvailable?: boolean
    isRetrying?: boolean
} = {}) => {
    const onRetry = jest.fn()
    render(
        <RecipeResultActions
            recipe={{ isFavorite: false } as RecipeDoc}
            isSaved={overrides.isSaved ?? false}
            isSaving={overrides.isSaving ?? false}
            retry={{
                isAvailable: overrides.isAvailable ?? true,
                isRetrying: overrides.isRetrying ?? false,
                onRetry
            }}
            onToggleFavorite={jest.fn()}
            onSave={jest.fn()}
            onStartCooking={jest.fn()}
        />
    )
    return { onRetry }
}

describe('RecipeResultActions retry button', () => {
    it('shows the design label and runs the retry', () => {
        const { onRetry } = setup()

        fireEvent.click(screen.getByRole('button', { name: texts.retry }))

        expect(onRetry).toHaveBeenCalledTimes(1)
    })

    it('is hidden when retry is not available (saved recipe or no stored request)', () => {
        setup({ isAvailable: false })

        expect(screen.queryByRole('button', { name: texts.retry })).not.toBeInTheDocument()
    })

    it('shows a disabled loading label while retrying and locks save and cook', () => {
        setup({ isRetrying: true })

        expect(screen.getByRole('button', { name: texts.retrying })).toBeDisabled()
        expect(screen.getByRole('button', { name: texts.save })).toBeDisabled()
        expect(screen.getByRole('button', { name: texts.startCooking })).toBeDisabled()
    })
})
