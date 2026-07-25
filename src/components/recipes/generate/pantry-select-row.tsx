import type { PantryItem } from '@/types/pantry-item'

import { Checkbox } from '@/components/ui/checkbox'

type PantrySelectRowProps = {
    item: PantryItem
    isSelected: boolean
    onToggle: () => void
}

export const PantrySelectRow = ({
    item,
    isSelected,
    onToggle
}: PantrySelectRowProps) => (
    <label className={'flex items-center gap-3 rounded-lg border border-border px-3 py-2.5'}>
        <Checkbox
            checked={isSelected}
            onCheckedChange={onToggle}
        />
        <span className={'text-body text-ink'}>
            {item.name}
        </span>
    </label>
)
