import {
    fireEvent,
    render,
    screen
} from '@testing-library/react'

import { ImportSourceTabs } from './import-source-tabs'

describe('ImportSourceTabs', () => {
    it('calls onChange with the clicked tab', () => {
        const onChange = jest.fn()
        render(
            <ImportSourceTabs
                tab={'url'}
                onChange={onChange}
            />
        )

        fireEvent.click(screen.getByText('טקסט'))

        expect(onChange).toHaveBeenCalledWith('text')
    })
})
