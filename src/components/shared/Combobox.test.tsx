import {
    fireEvent,
    render,
    screen
} from '@testing-library/react'

import { Combobox } from './Combobox'

const suggestions = ['עגבניה', 'עגבניות מרוסקות משומרות', 'בצל', 'מלפפון'] as const

describe('Combobox', () => {
    it('shows no suggestions before the input has any text', () => {
        render(
            <Combobox
                value={''}
                onChange={jest.fn()}
                suggestions={suggestions}
                onSelect={jest.fn()}
            />
        )

        expect(screen.queryByText('עגבניה')).not.toBeInTheDocument()
    })

    it('shows matching suggestions on focus once text is entered', () => {
        render(
            <Combobox
                value={'עגבני'}
                onChange={jest.fn()}
                suggestions={suggestions}
                onSelect={jest.fn()}
            />
        )

        fireEvent.focus(screen.getByRole('textbox'))

        expect(screen.getByText('עגבניה')).toBeInTheDocument()
        expect(screen.getByText('עגבניות מרוסקות משומרות')).toBeInTheDocument()
        expect(screen.queryByText('בצל')).not.toBeInTheDocument()
    })

    it('calls onSelect with the clicked suggestion', () => {
        const onSelect = jest.fn()
        render(
            <Combobox
                value={'עגבני'}
                onChange={jest.fn()}
                suggestions={suggestions}
                onSelect={onSelect}
            />
        )

        fireEvent.focus(screen.getByRole('textbox'))
        fireEvent.click(screen.getByText('עגבניה'))

        expect(onSelect).toHaveBeenCalledWith('עגבניה')
    })

    it('caps suggestions at 8 matches', () => {
        const manySuggestions = Array.from(
            { length: 20 },
            (_, index) => `פריט${index}`
        )
        render(
            <Combobox
                value={'פריט'}
                onChange={jest.fn()}
                suggestions={manySuggestions}
                onSelect={jest.fn()}
            />
        )

        fireEvent.focus(screen.getByRole('textbox'))

        expect(screen.getAllByRole('button')).toHaveLength(8)
    })
})
