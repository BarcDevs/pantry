import { render, screen } from '@testing-library/react'

import { CookingUnit } from '@/types/enums'

import { RecipeIngredientRow } from './recipe-ingredient-row'

describe('RecipeIngredientRow', () => {
    it('shows an optional tag for optional ingredients', () => {
        render(
            <RecipeIngredientRow
                ingredient={{
                    name: 'בזיליקום לקישוט',
                    baseName: 'בזיליקום',
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
                    baseName: 'עגבניות',
                    quantity: 1,
                    unit: CookingUnit.Units,
                    inPantry: true,
                    optional: false
                }}
            />
        )
        expect(screen.queryByText('רשות')).not.toBeInTheDocument()
    })

    it('flags a missing ingredient not found in the pantry', () => {
        render(
            <RecipeIngredientRow
                ingredient={{
                    name: 'פפריקה מתוקה',
                    baseName: 'פפריקה מתוקה',
                    quantity: 1,
                    unit: CookingUnit.Tsp,
                    inPantry: false,
                    optional: false
                }}
            />
        )
        expect(screen.getByText('חסר ·', { exact: false })).toBeInTheDocument()
    })

    it('does not flag an ingredient found in the pantry', () => {
        render(
            <RecipeIngredientRow
                ingredient={{
                    name: 'עגבניות',
                    baseName: 'עגבניות',
                    quantity: 1,
                    unit: CookingUnit.Units,
                    inPantry: true,
                    optional: false
                }}
            />
        )
        expect(screen.queryByText('חסר ·', { exact: false })).not.toBeInTheDocument()
    })

    it('shows a replacement suggestion instead of the missing label when one is available', () => {
        render(
            <RecipeIngredientRow
                ingredient={{
                    name: 'חלב סויה',
                    baseName: 'חלב סויה',
                    quantity: 1,
                    unit: CookingUnit.Units,
                    inPantry: false,
                    optional: false,
                    replacementName: 'חלב'
                }}
            />
        )
        expect(screen.getByText('תחליף זמין: חלב ·', { exact: false })).toBeInTheDocument()
        expect(screen.queryByText('חסר ·', { exact: false })).not.toBeInTheDocument()
    })
})
