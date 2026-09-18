import {
    fireEvent,
    render,
    screen
} from '@testing-library/react'

import { Input } from './Input'

describe('Input', () => {
    it('calls onEnter when Enter is pressed', () => {
        const onEnter = jest.fn()
        render(<Input onEnter={onEnter}/>)

        fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' })

        expect(onEnter).toHaveBeenCalledTimes(1)
    })

    it('ignores other keys', () => {
        const onEnter = jest.fn()
        render(<Input onEnter={onEnter}/>)

        fireEvent.keyDown(screen.getByRole('textbox'), { key: 'a' })

        expect(onEnter).not.toHaveBeenCalled()
    })

    it('does nothing on Enter without onEnter', () => {
        render(<Input/>)

        expect(() => fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' })).not.toThrow()
    })
})
