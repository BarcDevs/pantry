import {
    render,
    screen
} from '@testing-library/react'

import {
    FoodType,
    StorageLocation,
    Unit
} from '@/types/enums'
import type { PantryItem } from '@/types/pantry-item'

import { PantryItemCard } from './pantry-item-card'

const baseItem: PantryItem = {
    _id: '1',
    userId: 'u1',
    name: 'ביצים',
    storage: StorageLocation.Fridge,
    type: FoodType.Eggs,
    quantity: 6,
    unit: Unit.Units,
    source: 'manual',
    storageSuggestion: null
} as PantryItem

describe('PantryItemCard', () => {
    it('renders the icon derived from the food type, not a free emoji', () => {
        render(
            <PantryItemCard
                item={baseItem}
                onEdit={jest.fn()}
            />
        )
        expect(screen.getByText('🥚')).toBeInTheDocument()
    })

    it('falls back to a generic icon when there is no type', () => {
        render(
            <PantryItemCard
                item={{ ...baseItem, type: null }}
                onEdit={jest.fn()}
            />
        )
        expect(screen.getByText('📦')).toBeInTheDocument()
    })
})
