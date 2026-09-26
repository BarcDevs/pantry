import {
    fireEvent,
    render,
    screen
} from '@testing-library/react'

import type { Recipe } from '@/types/recipe'

import { RecipeCard } from './recipe-card'

const recipe: Recipe = {
    _id: 'r1',
    userId: 'u1',
    title: 'עוגה',
    source: 'manual',
    difficulty: 'easy',
    maxTime: 30,
    mealCount: 2,
    mealType: 'dinner',
    ingredients: [],
    steps: [],
    rating: null,
    history: [],
    isFavorite: false,
    tags: [],
    aiPromptContext: null
} as unknown as Recipe

describe('RecipeCard', () => {
    it('renders the title and links to the recipe detail page', () => {
        render(
            <RecipeCard
                recipe={recipe}
                onToggleFavorite={jest.fn()}
                onDelete={jest.fn()}
            />
        )
        expect(screen.getByText('עוגה')).toBeInTheDocument()
        expect(screen.getByRole('link')).toHaveAttribute('href', '/recipes/r1')
    })

    it('opens a confirm dialog on delete click without navigating', () => {
        render(
            <RecipeCard
                recipe={recipe}
                onToggleFavorite={jest.fn()}
                onDelete={jest.fn()}
            />
        )
        fireEvent.click(screen.getByLabelText('מחק מתכון'))
        expect(screen.getByText('למחוק את המתכון?')).toBeInTheDocument()
    })

    it('calls onDelete when the dialog is confirmed', async () => {
        const onDelete = jest.fn().mockResolvedValue(undefined)
        render(
            <RecipeCard
                recipe={recipe}
                onToggleFavorite={jest.fn()}
                onDelete={onDelete}
            />
        )
        fireEvent.click(screen.getByLabelText('מחק מתכון'))
        fireEvent.click(screen.getByText('מחיקה'))
        expect(onDelete).toHaveBeenCalled()
        await screen.findByLabelText('מחק מתכון')
    })

    it('mentions the real web source when the recipe used one', () => {
        render(
            <RecipeCard
                recipe={{
                    ...recipe,
                    source: 'imported_url',
                    sourceUrl: 'https://a.co.il/recipe',
                    sourceName: 'אתר א'
                }}
                onToggleFavorite={jest.fn()}
                onDelete={jest.fn()}
            />
        )

        expect(screen.getByRole('link', { name: 'מקור: אתר א' }))
            .toHaveAttribute('href', 'https://a.co.il/recipe')
    })

    it('does not show an AI-generated label on the card', () => {
        render(
            <RecipeCard
                recipe={{ ...recipe, source: 'ai_generated' }}
                onToggleFavorite={jest.fn()}
                onDelete={jest.fn()}
            />
        )

        expect(screen.queryByText('נוצר על ידי AI')).not.toBeInTheDocument()
    })
})
