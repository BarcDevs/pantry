import {
    fireEvent,
    render,
    screen,
    waitFor
} from '@testing-library/react'

import { recipesTexts } from '@/constants/texts/recipes'

import { searchRecipeImage } from '@/actions/recipes/search-recipe-image'

import { RecipeImageUrlField } from './recipe-image-url-field'

jest.mock('@/actions/recipes/search-recipe-image', () => ({
    searchRecipeImage: jest.fn()
}))

const mockSearchRecipeImage = searchRecipeImage as jest.Mock

const renderField = (imageUrl: string) => {
    const onChange = jest.fn()
    render(
        <RecipeImageUrlField
            imageUrl={imageUrl}
            onChange={onChange}
            title={'פסטה'}
            ingredientLabels={['עגבניה']}
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

describe('RecipeImageUrlField search', () => {
    beforeEach(() => {
        mockSearchRecipeImage.mockReset()
    })

    it('applies the found image', async () => {
        mockSearchRecipeImage.mockResolvedValue({ imageUrl: 'https://example.com/found.jpg' })
        const onChange = renderField('')

        fireEvent.click(screen.getByText(recipesTexts.result.searchImage))

        await waitFor(() => (
            expect(onChange).toHaveBeenCalledWith('https://example.com/found.jpg')
        ))
        expect(mockSearchRecipeImage).toHaveBeenCalledWith({
            title: 'פסטה',
            ingredients: ['עגבניה']
        })
    })

    it('does nothing when no image is found', async () => {
        mockSearchRecipeImage.mockResolvedValue({ imageUrl: null })
        const onChange = renderField('')

        fireEvent.click(screen.getByText(recipesTexts.result.searchImage))

        await waitFor(() => expect(mockSearchRecipeImage).toHaveBeenCalled())
        expect(onChange).not.toHaveBeenCalled()
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
