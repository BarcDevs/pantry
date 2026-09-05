import {
    fireEvent,
    render,
    screen
} from '@testing-library/react'

import { FoodType } from '@/types/enums'

import { PantryTypeFilter } from './pantry-type-filter'

describe('PantryTypeFilter', () => {
    it('toggles a type on and off across multiple selections', () => {
        const onChange = jest.fn()
        render(
            <PantryTypeFilter
                value={[FoodType.Eggs]}
                onChange={onChange}
            />
        )
        fireEvent.click(screen.getByText('סוג מוצר (1)'))
        fireEvent.click(screen.getByText('בשר'))
        expect(onChange).toHaveBeenCalledWith([FoodType.Eggs, FoodType.Meat])
    })

    it('removes an already-selected type', () => {
        const onChange = jest.fn()
        render(
            <PantryTypeFilter
                value={[FoodType.Eggs, FoodType.Meat]}
                onChange={onChange}
            />
        )
        fireEvent.click(screen.getByText('סוג מוצר (2)'))
        fireEvent.click(screen.getByText('ביצים'))
        expect(onChange).toHaveBeenCalledWith([FoodType.Meat])
    })

    it('clears all selections', () => {
        const onChange = jest.fn()
        render(
            <PantryTypeFilter
                value={[FoodType.Eggs]}
                onChange={onChange}
            />
        )
        fireEvent.click(screen.getByText('סוג מוצר (1)'))
        fireEvent.click(screen.getByText('נקה'))
        expect(onChange).toHaveBeenCalledWith([])
    })
})
