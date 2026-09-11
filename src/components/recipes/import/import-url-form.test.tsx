import {
    fireEvent,
    render,
    screen
} from '@testing-library/react'

import { ImportUrlForm } from './import-url-form'

describe('ImportUrlForm', () => {
    it('calls onUrlChange when the input changes', () => {
        const onUrlChange = jest.fn()
        render(
            <ImportUrlForm
                url={''}
                onUrlChange={onUrlChange}
            />
        )

        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'https://example.com/recipe' } })

        expect(onUrlChange).toHaveBeenCalledWith('https://example.com/recipe')
    })
})
