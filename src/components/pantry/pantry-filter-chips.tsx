import type { FoodType, StorageLocation } from '@/types/enums'
import { STORAGE_LOCATIONS } from '@/types/enums'
import type { SetState } from '@/types/react'

import { PantryTypeFilter } from '@/components/pantry/pantry-type-filter'
import { Button } from '@/components/shared/Button'

import { cn } from '@/lib/utils'

import { pantryTexts } from '@/constants/texts/pantry'

type PantryFilter = StorageLocation | 'all'

type PantryFilterChipsProps = {
    value: PantryFilter
    onChange: SetState<PantryFilter>
    typeFilterValue: FoodType[]
    onTypeFilterChange: SetState<FoodType[]>
}

const chipClassName = (isActive: boolean) => cn(
    'h-auto rounded-full border px-3.5 py-2 text-label font-semibold',
    isActive
        ? 'border-green bg-green text-white'
        : 'border-border bg-surface text-ink-2'
)

export const PantryFilterChips = ({
    value,
    onChange,
    typeFilterValue,
    onTypeFilterChange
}: PantryFilterChipsProps) => (
    <div className={'mb-4.5 flex flex-wrap items-center gap-2'}>
        <Button
            variant={'ghost'}
            onClick={() => onChange('all')}
            className={chipClassName(value === 'all')}
        >
            {pantryTexts.filterAll}
        </Button>
        {STORAGE_LOCATIONS.map((location) => (
            <Button
                key={location}
                variant={'ghost'}
                onClick={() => onChange(location)}
                className={chipClassName(value === location)}
            >
                {pantryTexts.storageLabels[location]}
            </Button>
        ))}
        <PantryTypeFilter
            value={typeFilterValue}
            onChange={onTypeFilterChange}
        />
    </div>
)
