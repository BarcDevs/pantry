import type { PantryItem }
    from '@/types/pantry-item'

import { Button }
    from '@/components/shared/buttons/Button'

import { recipesTexts }
    from '@/constants/texts/recipes'

type ExpiredItemsGateProps = {
    expiredItems: PantryItem[]
    onRemoveExpired: () => void
    onContinueAnyway: () => void
}

export const ExpiredItemsGate = ({
    expiredItems,
    onRemoveExpired,
    onContinueAnyway
}: ExpiredItemsGateProps) => (
    <div className={'flex flex-col gap-3 rounded-lg border-2 border-status-amber-fg bg-status-amber-bg px-4 py-3.5'}>
        <p className={'font-display text-heading font-weight-heading text-ink'}>
            {recipesTexts.generate.expiredGateTitle}
        </p>
        <p className={'text-label text-ink-3'}>
            {expiredItems.map((item) => item.name).join(', ')}
        </p>
        <p className={'text-label text-ink-3'}>
            {recipesTexts.generate.expiredGateDescription}
        </p>
        <div className={'flex gap-2'}>
            <Button
                variant={'ghost'}
                onClick={onRemoveExpired}
                className={'flex-1 rounded-md border border-border-2 bg-surface shadow-card'}
            >
                {recipesTexts.generate.expiredGateRemove}
            </Button>
            <Button
                variant={'ghost'}
                onClick={onContinueAnyway}
                className={'flex-1 rounded-md border border-border-2 bg-surface shadow-card'}
            >
                {recipesTexts.generate.expiredGateContinue}
            </Button>
        </div>
    </div>
)
