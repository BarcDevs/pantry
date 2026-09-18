import {
    fireEvent,
    render,
    screen
} from '@testing-library/react'

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
