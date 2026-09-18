import { render, screen } from '@testing-library/react'

import { commonTexts } from '@/constants/texts/common'

import { UrlInput } from './UrlInput'

describe('UrlInput', () => {
    it('shows no error for an empty value', () => {
        render(
            <UrlInput
                value={''}
                onChange={jest.fn()}
            />
        )

        expect(screen.queryByText(commonTexts.urlInvalid)).toBeNull()
    })

    it('accepts a url without a scheme', () => {
        render(
            <UrlInput
                value={'google.com'}
                onChange={jest.fn()}
            />
        )

        expect(screen.queryByText(commonTexts.urlInvalid)).toBeNull()
    })

    it('shows an inline error for an invalid url', () => {
        render(
            <UrlInput
                value={'not-a-url'}
                onChange={jest.fn()}
            />
        )

        expect(screen.getByText(commonTexts.urlInvalid)).toBeTruthy()
    })
})
