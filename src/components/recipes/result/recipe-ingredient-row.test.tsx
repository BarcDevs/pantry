import {
    fireEvent,
    render,
    screen
} from '@testing-library/react'

import { CookingUnit, FoodType } from '@/types/enums'

jest.mock('next/navigation', () => ({
    usePathname: () => '/generate/result'
}))

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
        expect(screen.getByText('חסר')).toBeInTheDocument()
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
        expect(screen.queryByText('חסר')).not.toBeInTheDocument()
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
        expect(screen.getByText('תחליף זמין: חלב')).toBeInTheDocument()
        expect(screen.queryByText('חסר')).not.toBeInTheDocument()
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

    it('shows the "now using" label instead of the replacement suggestion once added', () => {
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

        expect(screen.getByText('משתמשים בחלב')).toBeInTheDocument()
        expect(screen.queryByText('תחליף זמין: חלב')).not.toBeInTheDocument()
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

    it('shows the "removed" label once the removal was added', () => {
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

        expect(screen.getByText('הוסר')).toBeInTheDocument()
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

    it('links a missing ingredient to the add-item form and back', () => {
        render(
            <RecipeIngredientRow
                ingredient={{
                    label: 'עגבניות',
                    name: 'עגבניות',
                    category: FoodType.Vegetables,
                    quantity: 2,
                    unit: CookingUnit.Kg,
                    inPantry: false
                }}
            />
        )

        const href = screen.getByRole('link', { name: 'הוסף למזווה' }).getAttribute('href')!
        const params = new URLSearchParams(href.split('?')[1])

        expect(href.startsWith('/add?')).toBe(true)
        expect(params.get('name')).toBe('עגבניות')
        expect(params.get('quantity')).toBe('2')
        expect(params.get('unit')).toBe('kg')
        expect(params.get('returnTo')).toBe('/generate/result')
    })

    it('shows no add link for an ingredient already in the pantry', () => {
        render(
            <RecipeIngredientRow
                ingredient={{
                    label: 'עגבניות',
                    name: 'עגבניות',
                    category: FoodType.Vegetables,
                    quantity: 2,
                    unit: CookingUnit.Kg,
                    inPantry: true
                }}
            />
        )

        expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })

    it('still offers the add link when a replacement is suggested', () => {
        render(
            <RecipeIngredientRow
                ingredient={{
                    label: 'חלב',
                    name: 'חלב',
                    category: FoodType.Dairy,
                    quantity: 1,
                    unit: CookingUnit.L,
                    inPantry: false,
                    replacementName: 'חלב סויה'
                }}
            />
        )

        expect(screen.getByRole('link', { name: 'הוסף למזווה' })).toBeInTheDocument()
    })

    it('hides the add link while the replacement is in use', () => {
        render(
            <RecipeIngredientRow
                ingredient={{
                    label: 'חלב',
                    name: 'חלב',
                    category: FoodType.Dairy,
                    quantity: 1,
                    unit: CookingUnit.L,
                    inPantry: false,
                    replacementName: 'חלב סויה'
                }}
                isReplacementAdded
            />
        )

        expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })
})
