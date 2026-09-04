import {
    fireEvent,
    render,
    screen
} from '@testing-library/react'

import { CookingHistoryRowItem } from './cooking-history-row'

const row = {
    recipeId: 'r1',
    entryId: 'e1',
    name: 'עוגת שוקולד',
    emoji: '🍫',
    rating: 3,
    cookedAt: new Date('2026-01-10')
}

describe('CookingHistoryRowItem', () => {
    it('renders the recipe name and 5 stars, calling onRate on click', () => {
        const onRate = jest.fn()
        render(
            <CookingHistoryRowItem
                row={row}
                onRate={onRate}
            />
        )

        expect(screen.getByText('עוגת שוקולד')).toBeInTheDocument()
        fireEvent.click(screen.getByLabelText('4 כוכבים'))
        expect(onRate).toHaveBeenCalledWith(4)
    })

    it('shows a pencil edit-affordance icon next to the stars', () => {
        const { container } = render(
            <CookingHistoryRowItem
                row={row}
                onRate={jest.fn()}
            />
        )
        expect(container.querySelector('svg.lucide-pencil')).toBeInTheDocument()
    })
})
