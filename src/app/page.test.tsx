import { render, screen } from '@testing-library/react'
import Home from './page'

describe('Home', () => {
    it('renders the Pantry placeholder', () => {
        render(<Home />)
        expect(screen.getByText('Pantry')).toBeInTheDocument()
    })
})
