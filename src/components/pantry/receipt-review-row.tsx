import type { ReceiptReviewRow as Row } from '@/types/receipt-review-row'

import { Button } from '@/components/shared/Button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'

import { pantryTexts } from '@/constants/texts/pantry'

type ReceiptReviewRowProps = {
    row: Row
    onToggle: (id: string) => void
    onNameChange: (id: string, name: string) => void
    onQuantityChange: (id: string, quantity: number) => void
    onRemove: (id: string) => void
}

export const ReceiptReviewRow = ({
    row,
    onToggle,
    onNameChange,
    onQuantityChange,
    onRemove
}: ReceiptReviewRowProps) => (
    <div className={'flex items-center gap-3 rounded-lg border border-border-2 bg-surface p-3'}>
        <Checkbox
            checked={row.included}
            onCheckedChange={() => onToggle(row.id)}
            aria-label={row.name}
            className={'shrink-0'}
        />
        <Input
            value={row.name}
            onChange={(e) => onNameChange(row.id, e.target.value)}
            className={'min-w-0 flex-1 border-x-0 border-t-0 border-b-border bg-transparent text-body font-bold text-ink shadow-none focus-visible:ring-0'}
        />
        <Input
            type={'number'}
            value={row.quantity}
            onChange={(e) => onQuantityChange(row.id, Number(e.target.value))}
            className={'w-16 shrink-0 text-center'}
        />
        <span className={'shrink-0 text-caption text-ink-3'}>
            {pantryTexts.unitLabels[row.unit]}
        </span>
        <Button
            type={'button'}
            variant={'ghost'}
            size={'icon'}
            onClick={() => onRemove(row.id)}
        >
            {'✕'}
        </Button>
    </div>
)
