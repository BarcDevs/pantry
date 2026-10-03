import {
    fireEvent,
    render,
    screen
} from '@testing-library/react'

import { recipesTexts } from '@/constants/texts/recipes'

import { RecipeTitleEditor } from './recipe-title-editor'

const renderEditor = (title: string) => {
    const onChange = jest.fn()
    render(
        <RecipeTitleEditor
            title={title}
            onChange={onChange}
        />
    )
    return onChange
}

describe('RecipeTitleEditor', () => {
    it('shows the current title and applies a change', () => {
        const onChange = renderEditor('פסטה ברוטב עגבניות')
        const input = screen.getByRole('textbox')
        expect(input).toHaveValue('פסטה ברוטב עגבניות')

        fireEvent.change(input, { target: { value: 'פסטה ברוטב עגבניות חריף' } })
        fireEvent.click(screen.getByText(recipesTexts.detail.titleApply))

        expect(onChange).toHaveBeenCalledWith('פסטה ברוטב עגבניות חריף')
    })

    it('trims the new title before applying', () => {
        const onChange = renderEditor('פסטה')
        const input = screen.getByRole('textbox')

        fireEvent.change(input, { target: { value: '  פסטה חדשה  ' } })
        fireEvent.click(screen.getByText(recipesTexts.detail.titleApply))

        expect(onChange).toHaveBeenCalledWith('פסטה חדשה')
    })

    it('disables apply when the title is unchanged', () => {
        renderEditor('פסטה')
        expect(screen.getByText(recipesTexts.detail.titleApply)).toBeDisabled()
    })

    it('disables apply when the draft is empty', () => {
        const onChange = renderEditor('פסטה')
        const input = screen.getByRole('textbox')

        fireEvent.change(input, { target: { value: '   ' } })

        expect(screen.getByText(recipesTexts.detail.titleApply)).toBeDisabled()
        fireEvent.click(screen.getByText(recipesTexts.detail.titleApply))
        expect(onChange).not.toHaveBeenCalled()
    })

    it('applies on Enter', () => {
        const onChange = renderEditor('פסטה')
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'פסטה חדשה' } })
        fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' })

        expect(onChange).toHaveBeenCalledWith('פסטה חדשה')
    })
})
