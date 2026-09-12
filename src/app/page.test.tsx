import { render, screen } from '@testing-library/react'

jest.mock('next-auth/react', () => ({
    useSession: () => ({ data: null, status: 'unauthenticated' })
}))

import Home from './page'

describe('Home', () => {
    it('renders the Pantry placeholder', () => {
        render(<Home/>)
        expect(screen.getByText('Pantry')).toBeInTheDocument()
    })
})
