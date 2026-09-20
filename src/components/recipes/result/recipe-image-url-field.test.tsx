import {
    fireEvent,
    render,
    screen
} from '@testing-library/react'

import { recipesTexts } from '@/constants/texts/recipes'

import { RecipeImageUrlField } from './recipe-image-url-field'

const renderField = (imageUrl: string) => {
    const onChange = jest.fn()
    render(
        <RecipeImageUrlField
            imageUrl={imageUrl}
            onChange={onChange}
        />
    )
    return onChange
}

describe('RecipeImageUrlField with an existing image', () => {
    it('shows the current url, replaces it and hides the no-image description', () => {
        const onChange = renderField('https://example.com/old.jpg')
        const input = screen.getByRole('textbox')
        expect(input).toHaveValue('https://example.com/old.jpg')
        expect(screen.queryByText(recipesTexts.result.imageFieldDescription)).toBeNull()

        fireEvent.change(input, { target: { value: 'https://example.com/new.jpg' } })
        fireEvent.click(screen.getByText(recipesTexts.result.applyImage))

        expect(onChange).toHaveBeenCalledWith('https://example.com/new.jpg')
    })

    it('removes the image', () => {
        const onChange = renderField('https://example.com/old.jpg')
        fireEvent.click(screen.getByText(recipesTexts.result.removeImage))
        expect(onChange).toHaveBeenCalledWith('')
    })

    it('shows the description and no remove control without an image', () => {
        renderField('')
        expect(screen.getByText(recipesTexts.result.imageFieldDescription)).toBeInTheDocument()
        expect(screen.queryByText(recipesTexts.result.removeImage)).toBeNull()
    })
})

describe('RecipeImageUrlField Enter', () => {
    it('applies a valid url as https', () => {
        const onChange = renderField('example.com/pic.jpg')
        fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' })
        expect(onChange).toHaveBeenCalledWith('https://example.com/pic.jpg')
    })

    it('does not apply an invalid url', () => {
        const onChange = renderField('not-a-url')
        fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' })
        expect(onChange).not.toHaveBeenCalled()
    })
})
