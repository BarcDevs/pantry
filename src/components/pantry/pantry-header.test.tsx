import { render, screen } from '@testing-library/react'

import { PantryHeader } from './pantry-header'

describe('PantryHeader', () => {
    it('renders the history icon as a disabled placeholder when there is no cooking history', () => {
        render(
            <PantryHeader
                displayName={'בר'}
                hasCookingHistory={false}
            />
        )

        expect(screen.queryByRole('link', { name: '' })).not.toBeInTheDocument()
    })

    it('renders the history icon as a link to /history when cooking history exists', () => {
        render(
            <PantryHeader
                displayName={'בר'}
                hasCookingHistory={true}
            />
        )

        const links = screen.getAllByRole('link')
        expect(links.some((link) => link.getAttribute('href') === '/history')).toBe(true)
    })
})
