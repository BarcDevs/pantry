import type { StorageLocation } from '@/types/enums'
import { STORAGE_LOCATIONS } from '@/types/enums'
import type { SetState } from '@/types/react'

import { Button } from '@/components/shared/Button'

import { cn } from '@/lib/utils'

import { pantryTexts } from '@/constants/texts/pantry'

type PantryFilter = StorageLocation | 'all'

type PantryFilterChipsProps = {
    value: PantryFilter
    onChange: SetState<PantryFilter>
}

const chipClassName = (isActive: boolean) => cn(
    'h-auto rounded-full border px-3.5 py-2 text-label font-semibold',
    isActive
        ? 'border-green bg-green text-white'
        : 'border-border bg-surface text-ink-2'
)

export const PantryFilterChips = ({
    value,
    onChange
}: PantryFilterChipsProps) => (
    <div className={'mb-4.5 flex flex-wrap gap-2'}>
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
    </div>
)
