import {
    fireEvent,
    render,
    screen
} from '@testing-library/react'

import { ReceiptUrlForm } from './receipt-url-form'

const renderForm = (url: string, isSubmitting = false) => {
    const onSubmit = jest.fn()
    render(
        <ReceiptUrlForm
            url={url}
            onUrlChange={jest.fn()}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            error={null}
        />
    )
    return onSubmit
}

describe('ReceiptUrlForm Enter', () => {
    it('submits a valid url', () => {
        const onSubmit = renderForm('example.com/receipt')
        fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' })
        expect(onSubmit).toHaveBeenCalledTimes(1)
    })

    it.each([
        ['empty', ''],
        ['invalid', 'not-a-url']
    ])('does not submit an %s url', (_label, url) => {
        const onSubmit = renderForm(url)
        fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' })
        expect(onSubmit).not.toHaveBeenCalled()
    })

    it('does not submit while submitting', () => {
        const onSubmit = renderForm('example.com/receipt', true)
        fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' })
        expect(onSubmit).not.toHaveBeenCalled()
    })
})
