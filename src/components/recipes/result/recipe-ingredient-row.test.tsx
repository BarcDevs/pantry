import { render, screen } from '@testing-library/react'

import { CookingUnit } from '@/types/enums'

import { RecipeIngredientRow } from './recipe-ingredient-row'

describe('RecipeIngredientRow', () => {
    it('shows an optional tag for optional ingredients', () => {
        render(
            <RecipeIngredientRow
                ingredient={{
                    name: 'בזיליקום לקישוט',
                    quantity: 1,
                    unit: CookingUnit.Units,
                    inPantry: false,
                    optional: true
                }}
            />
        )
        expect(screen.getByText('רשות')).toBeInTheDocument()
    })

    it('does not show the tag for a required ingredient', () => {
        render(
            <RecipeIngredientRow
                ingredient={{
                    name: 'עגבניות',
                    quantity: 1,
                    unit: CookingUnit.Units,
                    inPantry: true,
                    optional: false
                }}
            />
        )
        expect(screen.queryByText('רשות')).not.toBeInTheDocument()
    })
})
