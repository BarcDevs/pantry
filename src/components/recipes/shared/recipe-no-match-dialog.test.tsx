import {
    fireEvent,
    render,
    screen
} from '@testing-library/react'

import { RecipeNoMatchDialog } from '@/components/recipes/shared/recipe-no-match-dialog'

import { recipesTexts } from '@/constants/texts/recipes'

const texts = recipesTexts.generate.noMatchDialog

const setup = (dish: string) => {
    const onEnableAi = jest.fn()
    const onDismiss = jest.fn()
    render(
        <RecipeNoMatchDialog
            open={true}
            dish={dish}
            onEnableAi={onEnableAi}
            onDismiss={onDismiss}
        />
    )
    return {
        onEnableAi,
        onDismiss
    }
}

describe('RecipeNoMatchDialog', () => {
    it('shows the design title and the body quoting the requested dish', () => {
        setup('לזניה')

        expect(screen.getByText(texts.title)).toBeInTheDocument()
        expect(screen.getByText(texts.body('לזניה'))).toBeInTheDocument()
    })

    it('uses the body without the dish quote when no dish was requested', () => {
        setup('')

        expect(screen.getByText(texts.bodyWithoutDish)).toBeInTheDocument()
    })

    it('runs enable-AI from the primary button and dismiss from the secondary one', () => {
        const actions = setup('לזניה')

        fireEvent.click(screen.getByRole('button', { name: texts.enableAi }))
        expect(actions.onEnableAi).toHaveBeenCalledTimes(1)

        fireEvent.click(screen.getByRole('button', { name: texts.editRequest }))
        expect(actions.onDismiss).toHaveBeenCalledTimes(1)
    })

    it('disables both buttons while busy', () => {
        render(
            <RecipeNoMatchDialog
                open={true}
                dish={''}
                isBusy={true}
                onEnableAi={jest.fn()}
                onDismiss={jest.fn()}
            />
        )

        expect(screen.getByRole('button', { name: texts.enableAi })).toBeDisabled()
        expect(screen.getByRole('button', { name: texts.editRequest })).toBeDisabled()
    })
})
