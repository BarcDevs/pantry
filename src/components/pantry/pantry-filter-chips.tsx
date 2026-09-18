import type { FoodType, StorageLocation } from '@/types/enums'
import { STORAGE_LOCATIONS } from '@/types/enums'
import type { SetState } from '@/types/react'

import { PantryTypeFilter } from '@/components/pantry/pantry-type-filter'
import { ChipButton } from '@/components/shared/buttons/ChipButton'

import { pantryTexts } from '@/constants/texts/pantry'

type PantryFilter = StorageLocation | 'all'

type PantryFilterChipsProps = {
    value: PantryFilter
    onChange: SetState<PantryFilter>
    typeFilterValue: FoodType[]
    onTypeFilterChange: SetState<FoodType[]>
}

export const PantryFilterChips = ({
    value,
    onChange,
    typeFilterValue,
    onTypeFilterChange
}: PantryFilterChipsProps) => (
    <div className={'mb-4.5 flex flex-wrap items-center gap-2'}>
        <ChipButton
            isSelected={value === 'all'}
            onClick={() => onChange('all')}
        >
            {pantryTexts.filterAll}
        </ChipButton>
        {STORAGE_LOCATIONS.map((location) => (
            <ChipButton
                key={location}
                isSelected={value === location}
                onClick={() => onChange(location)}
            >
                {pantryTexts.storageLabels[location]}
            </ChipButton>
        ))}
        <PantryTypeFilter
            value={typeFilterValue}
            onChange={onTypeFilterChange}
        />
    </div>
)
