import {
    render,
    screen
} from '@testing-library/react'

import { landingTexts } from '@/constants/texts/landing'

import Home from './page'

describe('Home landing page', () => {
    it('renders the hero headline and primary CTA', () => {
        render(<Home/>)

        expect(screen.getByText(landingTexts.hero.titleHighlight)).toBeInTheDocument()
        expect(screen.getAllByText(landingTexts.nav.cta).length).toBeGreaterThan(0)
    })

    it('links the sign-up CTA to /sign-up', () => {
        render(<Home/>)

        const links = screen.getAllByText(landingTexts.nav.cta)
        expect(links[0].closest('a')).toHaveAttribute('href', '/sign-up')
    })

    it('renders all feature cards', () => {
        render(<Home/>)

        for (const card of landingTexts.features.cards) {
            expect(screen.getByText(card.title)).toBeInTheDocument()
        }
    })

    it('renders the FAQ items', () => {
        render(<Home/>)

        for (const item of landingTexts.faq.items) {
            expect(screen.getByText(item.question)).toBeInTheDocument()
        }
    })
})
