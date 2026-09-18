import {
    fireEvent,
    render,
    screen
} from '@testing-library/react'

import { RecipeRefineInput } from './recipe-refine-input'

const renderInput = (value: string, isRefining = false) => {
    const onSubmit = jest.fn()
    render(
        <RecipeRefineInput
            value={value}
            onChange={jest.fn()}
            onSubmit={onSubmit}
            isRefining={isRefining}
        />
    )
    return onSubmit
}

describe('RecipeRefineInput Enter', () => {
    it('submits a non-empty request', () => {
        const onSubmit = renderInput('פחות מלח')
        fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' })
        expect(onSubmit).toHaveBeenCalledTimes(1)
    })

    it.each([
        ['empty', '', false],
        ['refining', 'פחות מלח', true]
    ])('does not submit when %s', (_label, value, isRefining) => {
        const onSubmit = renderInput(value, isRefining)
        fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' })
        expect(onSubmit).not.toHaveBeenCalled()
    })
})
