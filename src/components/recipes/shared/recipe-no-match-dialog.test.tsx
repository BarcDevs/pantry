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
    const onEditRequest = jest.fn()
    render(
        <RecipeNoMatchDialog
            open={true}
            dish={dish}
            onEnableAi={onEnableAi}
            onEditRequest={onEditRequest}
        />
    )
    return {
        onEnableAi,
        onEditRequest
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
        expect(actions.onEditRequest).toHaveBeenCalledTimes(1)
    })

    it('disables both buttons while busy', () => {
        render(
            <RecipeNoMatchDialog
                open={true}
                dish={''}
                isBusy={true}
                onEnableAi={jest.fn()}
                onEditRequest={jest.fn()}
            />
        )

        expect(screen.getByRole('button', { name: texts.enableAi })).toBeDisabled()
        expect(screen.getByRole('button', { name: texts.editRequest })).toBeDisabled()
    })

    it('closes through onClose on Escape when given, else falls back to onEditRequest', () => {
        const onClose = jest.fn()
        const onEditRequest = jest.fn()
        const { rerender } = render(
            <RecipeNoMatchDialog
                open={true}
                dish={''}
                onEnableAi={jest.fn()}
                onEditRequest={onEditRequest}
                onClose={onClose}
            />
        )

        fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
        expect(onClose).toHaveBeenCalledTimes(1)
        expect(onEditRequest).not.toHaveBeenCalled()

        rerender(
            <RecipeNoMatchDialog
                open={true}
                dish={''}
                onEnableAi={jest.fn()}
                onEditRequest={onEditRequest}
            />
        )
        fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
        expect(onEditRequest).toHaveBeenCalledTimes(1)
    })
})
