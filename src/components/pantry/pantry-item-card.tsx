import type { PantryItem } from '@/types/pantry-item'

import { PantryExpiryChip } from '@/components/pantry/pantry-expiry-chip'
import { SurfaceButton } from '@/components/shared/buttons/SurfaceButton'

import { getExpiryStatus } from '@/lib/pantry/expiry-status'
import { getFoodTypeIcon } from '@/lib/pantry/food-type-icon'

import { pantryTexts } from '@/constants/texts/pantry'

type PantryItemCardProps = {
    item: PantryItem
    onEdit: () => void
}

export const PantryItemCard = ({
    item,
    onEdit
}: PantryItemCardProps) => (
    <SurfaceButton
        onClick={onEdit}
        className={'block rounded-lg border border-border-2 bg-surface p-4 shadow-card'}
    >
        <div className={'flex items-start justify-between'}>
            <span className={'text-2xl'}>
                {getFoodTypeIcon(item.type)}
            </span>
            <PantryExpiryChip status={getExpiryStatus(item.expiryDate)}/>
        </div>
        <div className={'mt-2.5 text-heading font-bold text-ink'}>
            {item.name}
        </div>
        <div className={'mt-0.5 text-label text-ink-3'}>
            {`${item.quantity} ${pantryTexts.unitLabels[item.unit]} · ${pantryTexts.storageLabels[item.storage]}`}
        </div>
    </SurfaceButton>
)
