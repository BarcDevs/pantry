import { ListFilterIcon } from 'lucide-react'

import type { FoodType } from '@/types/enums'
import { FOOD_TYPES } from '@/types/enums'
import type { SetState } from '@/types/react'

import { Button } from '@/components/shared/buttons/Button'
import { TextButton } from '@/components/shared/buttons/TextButton'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover'

import { cn } from '@/lib/utils'

import { foodTypeEmoji } from '@/constants/food-type-emoji'
import { pantryTexts } from '@/constants/texts/pantry'

type PantryTypeFilterProps = {
    value: FoodType[]
    onChange: SetState<FoodType[]>
}

export const PantryTypeFilter = ({
    value,
    onChange
}: PantryTypeFilterProps) => {
    const toggleType = (type: FoodType) => {
        onChange(value.includes(type)
            ? value.filter((t) => t !== type)
            : [...value, type])
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={'ghost'}
                    className={cn(
                        'h-auto cursor-pointer gap-1.5 rounded-full border px-3.5 py-2 text-label font-semibold',
                        value.length > 0
                            ? 'border-green bg-green text-white'
                            : 'border-border bg-surface text-ink-2'
                    )}
                >
                    <ListFilterIcon size={14}/>
                    {pantryTexts.typeFilterLabel}
                    {value.length > 0 && ` (${value.length})`}
                </Button>
            </PopoverTrigger>
            <PopoverContent className={'w-64'}>
                <div className={'flex flex-col gap-2.5'}>
                    {FOOD_TYPES.map((type) => (
                        <label
                            key={type}
                            className={'flex cursor-pointer items-center gap-2.5 text-label text-ink'}
                        >
                            <Checkbox
                                checked={value.includes(type)}
                                onCheckedChange={() => toggleType(type)}
                                className={'cursor-pointer'}
                            />
                            <span>
                                {foodTypeEmoji[type]}
                            </span>
                            <span>
                                {pantryTexts.foodTypeLabels[type]}
                            </span>
                        </label>
                    ))}
                    {value.length > 0 && (
                        <TextButton
                            tone={'muted'}
                            onClick={() => onChange([])}
                            className={'text-caption'}
                        >
                            {pantryTexts.typeFilterClear}
                        </TextButton>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
