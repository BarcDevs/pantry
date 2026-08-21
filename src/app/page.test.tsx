import { render, screen } from '@testing-library/react'

jest.mock('@clerk/nextjs', () => ({
    Show: () => null,
    SignInButton: () => null,
    SignUpButton: () => null,
    UserButton: () => null
}))

import Home from './page'

describe('Home', () => {
    it('renders the Pantry placeholder', () => {
        render(<Home/>)
        expect(screen.getByText('Pantry')).toBeInTheDocument()
    })
})
