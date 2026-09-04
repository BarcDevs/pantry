import { CheckIcon } from 'lucide-react'

import type { PantryItem } from '@/types/pantry-item'

import { PantryExpiryChip } from '@/components/pantry/pantry-expiry-chip'
import { Button } from '@/components/shared/Button'

import { getExpiryStatus } from '@/lib/pantry/expiry-status'
import { cn } from '@/lib/utils'

import { pantryTexts } from '@/constants/texts/pantry'

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
    <Button
        variant={'ghost'}
        onClick={onToggle}
        className={cn(
            'h-auto w-full items-center justify-start gap-3 rounded-lg border p-3 text-start font-normal',
            isSelected
                ? 'border-soft-green-border bg-soft-green-bg'
                : 'border-border-2 bg-surface'
        )}
    >
        <span
            className={cn(
                'flex size-6 shrink-0 items-center justify-center rounded-sm border-1.5',
                isSelected ? 'border-green bg-green' : 'border-track bg-surface'
            )}
        >
            {isSelected && (
                <CheckIcon
                    size={14}
                    className={'text-surface'}
                />
            )}
        </span>
        <span className={'text-body'}>
            {item.emoji ?? '🥫'}
        </span>
        <span className={'flex min-w-0 flex-1 flex-col'}>
            <span className={'truncate font-bold text-body text-ink'}>
                {item.name}
            </span>
            <span className={'truncate text-caption text-ink-3'}>
                {`${item.quantity} ${pantryTexts.unitLabels[item.unit]} · ${pantryTexts.storageLabels[item.storage]}`}
            </span>
        </span>
        <PantryExpiryChip status={getExpiryStatus(item.expiryDate)}/>
    </Button>
)
