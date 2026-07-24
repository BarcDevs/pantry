import type { PantryItem } from '@/types/pantry-item'

import { PantryExpiryChip } from '@/components/pantry/pantry-expiry-chip'
import { Button } from '@/components/shared/Button'

import { getExpiryStatus } from '@/lib/pantry/expiry-status'

import { pantryTexts } from '@/constants/texts/pantry'

type PantryItemCardProps = {
    item: PantryItem
    onEdit: () => void
}

export const PantryItemCard = ({
    item,
    onEdit
}: PantryItemCardProps) => (
    <Button
        variant={'ghost'}
        onClick={onEdit}
        className={'block h-auto w-full rounded-lg border border-border bg-surface p-4 text-start font-normal shadow-card'}
    >
        <div className={'flex items-start justify-between'}>
            <span className={'text-2xl'}>
                {item.emoji ?? '🥫'}
            </span>
            <PantryExpiryChip status={getExpiryStatus(item.expiryDate)}/>
        </div>
        <div className={'mt-2.5 text-heading font-bold text-ink'}>
            {item.name}
        </div>
        <div className={'mt-0.5 text-label text-ink-3'}>
            {`${item.quantity} ${pantryTexts.unitLabels[item.unit]} · ${pantryTexts.storageLabels[item.storage]}`}
        </div>
    </Button>
)
