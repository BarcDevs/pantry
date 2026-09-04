import {
    fireEvent,
    render,
    screen
} from '@testing-library/react'

import { ImportUrlForm } from './import-url-form'

describe('ImportUrlForm', () => {
    it('calls onSubmit when the button is clicked with a non-empty url', () => {
        const onSubmit = jest.fn()
        render(
            <ImportUrlForm
                url={'https://example.com/recipe'}
                onUrlChange={jest.fn()}
                onSubmit={onSubmit}
                isSubmitting={false}
                error={null}
            />
        )

        fireEvent.click(screen.getByRole('button'))

        expect(onSubmit).toHaveBeenCalled()
    })

    it('renders an error message when provided', () => {
        render(
            <ImportUrlForm
                url={'https://example.com'}
                onUrlChange={jest.fn()}
                onSubmit={jest.fn()}
                isSubmitting={false}
                error={'הייבוא נכשל'}
            />
        )

        expect(screen.getByText('הייבוא נכשל')).toBeInTheDocument()
    })
})
