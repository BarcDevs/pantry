import {
    fireEvent,
    render,
    screen
} from '@testing-library/react'

import { CookingUnit, FoodType } from '@/types/enums'

import { RecipeIngredientRow } from './recipe-ingredient-row'

describe('RecipeIngredientRow', () => {
    it('shows an optional tag for optional ingredients', () => {
        render(
            <RecipeIngredientRow
                ingredient={{
                    label: 'בזיליקום לקישוט',
                    name: 'בזיליקום לקישוט',
                    category: FoodType.Vegetables,
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
                    label: 'עגבניות',
                    name: 'עגבניות',
                    category: FoodType.Vegetables,
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
                    label: 'פפריקה מתוקה',
                    name: 'פפריקה מתוקה',
                    category: FoodType.Vegetables,
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
                    label: 'עגבניות',
                    name: 'עגבניות',
                    category: FoodType.Vegetables,
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
                    label: 'חלב סויה',
                    name: 'חלב סויה',
                    category: FoodType.Vegetables,
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

    it('does not show an add-to-adjustments button without a replacement handler', () => {
        render(
            <RecipeIngredientRow
                ingredient={{
                    label: 'חלב סויה',
                    name: 'חלב סויה',
                    category: FoodType.Vegetables,
                    quantity: 1,
                    unit: CookingUnit.Units,
                    inPantry: false,
                    optional: false,
                    replacementName: 'חלב'
                }}
            />
        )
        expect(screen.queryByText('הוסף להתאמות המתכון')).not.toBeInTheDocument()
    })

    it('calls onToggleReplacement when the add-to-adjustments button is clicked', () => {
        const onToggleReplacement = jest.fn()
        render(
            <RecipeIngredientRow
                ingredient={{
                    label: 'חלב סויה',
                    name: 'חלב סויה',
                    category: FoodType.Vegetables,
                    quantity: 1,
                    unit: CookingUnit.Units,
                    inPantry: false,
                    optional: false,
                    replacementName: 'חלב'
                }}
                onToggleReplacement={onToggleReplacement}
            />
        )

        fireEvent.click(screen.getByText('הוסף להתאמות המתכון'))

        expect(onToggleReplacement).toHaveBeenCalledTimes(1)
    })

    it('shows the remove-from-adjustments label when the replacement was already added', () => {
        render(
            <RecipeIngredientRow
                ingredient={{
                    label: 'חלב סויה',
                    name: 'חלב סויה',
                    category: FoodType.Vegetables,
                    quantity: 1,
                    unit: CookingUnit.Units,
                    inPantry: false,
                    optional: false,
                    replacementName: 'חלב'
                }}
                isReplacementAdded
                onToggleReplacement={jest.fn()}
            />
        )

        expect(screen.getByText('הסר מההתאמות')).toBeInTheDocument()
        expect(screen.queryByText('הוסף להתאמות המתכון')).not.toBeInTheDocument()
    })

    it('does not show a remove button for an optional ingredient without a removal handler', () => {
        render(
            <RecipeIngredientRow
                ingredient={{
                    label: 'בזיליקום לקישוט',
                    name: 'בזיליקום לקישוט',
                    category: FoodType.Vegetables,
                    quantity: 1,
                    unit: CookingUnit.Units,
                    inPantry: true,
                    optional: true
                }}
            />
        )
        expect(screen.queryByText('הסר מהמתכון')).not.toBeInTheDocument()
    })

    it('calls onToggleRemoval when the remove button is clicked', () => {
        const onToggleRemoval = jest.fn()
        render(
            <RecipeIngredientRow
                ingredient={{
                    label: 'בזיליקום לקישוט',
                    name: 'בזיליקום לקישוט',
                    category: FoodType.Vegetables,
                    quantity: 1,
                    unit: CookingUnit.Units,
                    inPantry: true,
                    optional: true
                }}
                onToggleRemoval={onToggleRemoval}
            />
        )

        fireEvent.click(screen.getByText('הסר מהמתכון'))

        expect(onToggleRemoval).toHaveBeenCalledTimes(1)
    })

    it('shows the remove-from-adjustments label once the removal was added', () => {
        render(
            <RecipeIngredientRow
                ingredient={{
                    label: 'בזיליקום לקישוט',
                    name: 'בזיליקום לקישוט',
                    category: FoodType.Vegetables,
                    quantity: 1,
                    unit: CookingUnit.Units,
                    inPantry: true,
                    optional: true
                }}
                isRemovalAdded
                onToggleRemoval={jest.fn()}
            />
        )

        expect(screen.getByText('הסר מההתאמות')).toBeInTheDocument()
        expect(screen.queryByText('הסר מהמתכון')).not.toBeInTheDocument()
    })

    it('does not show a remove button for a required (non-optional) ingredient', () => {
        render(
            <RecipeIngredientRow
                ingredient={{
                    label: 'עגבניות',
                    name: 'עגבניות',
                    category: FoodType.Vegetables,
                    quantity: 1,
                    unit: CookingUnit.Units,
                    inPantry: true,
                    optional: false
                }}
                onToggleRemoval={jest.fn()}
            />
        )
        expect(screen.queryByText('הסר מהמתכון')).not.toBeInTheDocument()
    })
})
