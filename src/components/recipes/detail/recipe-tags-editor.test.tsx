import {
    fireEvent,
    render,
    screen
} from '@testing-library/react'

import { RecipeTagsEditor } from './recipe-tags-editor'

describe('RecipeTagsEditor Enter', () => {
    it('adds the typed tag', () => {
        const onChange = jest.fn()
        render(
            <RecipeTagsEditor
                tags={['ארוחת ערב']}
                onChange={onChange}
            />
        )
        const input = screen.getByRole('textbox')

        fireEvent.change(input, { target: { value: 'מהיר' } })
        fireEvent.keyDown(input, { key: 'Enter' })

        expect(onChange).toHaveBeenCalledWith(['ארוחת ערב', 'מהיר'])
    })
})
