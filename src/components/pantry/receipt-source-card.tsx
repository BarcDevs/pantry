import { TextButton } from '@/components/shared/buttons/TextButton'

import { pantryTexts } from '@/constants/texts/pantry'

type ReceiptSourceCardProps = {
    icon: string
    label: string
    itemCount: number
    allSelected: boolean
    onToggleAll: () => void
    onClearAll: () => void
}

export const ReceiptSourceCard = ({
    icon,
    label,
    itemCount,
    allSelected,
    onToggleAll,
    onClearAll
}: ReceiptSourceCardProps) => (
    <div className={'mb-3.5 flex items-center gap-3.25 rounded-2xl border border-border-2 bg-surface py-3.5 px-4'}>
        <span className={'flex size-10.5 shrink-0 items-center justify-center rounded-md bg-soft-green-bg text-heading'}>
            {icon}
        </span>
        <div className={'min-w-0 flex-1'}>
            <div className={'truncate font-bold text-body text-ink'}>
                {label}
            </div>
            <div className={'text-caption text-ink-3'}>
                {pantryTexts.receiptReview.itemsDetectedCount(itemCount)}
            </div>
        </div>
        <div className={'flex shrink-0 flex-col items-start gap-1.75'}>
            <TextButton
                onClick={onToggleAll}
                className={'text-label'}
            >
                {allSelected
                    ? pantryTexts.receiptReview.deselectAll
                    : pantryTexts.receiptReview.selectAll}
            </TextButton>
            <TextButton
                tone={'red'}
                onClick={onClearAll}
                className={'text-label'}
            >
                {pantryTexts.receiptReview.clearAll}
            </TextButton>
        </div>
    </div>
)
