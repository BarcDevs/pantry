import type { PantryItem } from '@/types/pantry-item'

import { PantryItemCard } from '@/components/pantry/pantry-item-card'

type PantryGridProps = {
    items: PantryItem[]
    onEditItem: (item: PantryItem) => void
}

export const PantryGrid = ({
    items,
    onEditItem
}: PantryGridProps) => (
    <div className={'grid grid-cols-2 gap-3 md:grid-cols-3'}>
        {items.map((item) => (
            <PantryItemCard
                key={item._id}
                item={item}
                onEdit={() => onEditItem(item)}
            />
        ))}
    </div>
)
