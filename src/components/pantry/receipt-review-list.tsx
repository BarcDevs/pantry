import type { ReceiptReviewRow as Row } from '@/types/receipt-review-row'

import { ReceiptReviewRow } from '@/components/pantry/receipt-review-row'
import { Button } from '@/components/shared/Button'

import { pantryTexts } from '@/constants/texts/pantry'

type ReceiptReviewListProps = {
    rows: Row[]
    isSubmitting: boolean
    onToggle: (id: string) => void
    onNameChange: (id: string, name: string) => void
    onQuantityChange: (id: string, quantity: number) => void
    onRemove: (id: string) => void
    onSelectAll: () => void
    onClearAll: () => void
    onConfirm: () => void
    onCancel: () => void
}

export const ReceiptReviewList = ({
    rows,
    isSubmitting,
    onToggle,
    onNameChange,
    onQuantityChange,
    onRemove,
    onSelectAll,
    onClearAll,
    onConfirm,
    onCancel
}: ReceiptReviewListProps) => (
    <div className={'flex flex-col gap-4'}>
        <p className={'text-body text-ink-3'}>
            {pantryTexts.receiptReview.subtitle}
        </p>
        <div className={'flex justify-end gap-4'}>
            <Button
                type={'button'}
                variant={'ghost'}
                onClick={onSelectAll}
            >
                {pantryTexts.receiptReview.selectAll}
            </Button>
            <Button
                type={'button'}
                variant={'ghost'}
                onClick={onClearAll}
            >
                {pantryTexts.receiptReview.clearAll}
            </Button>
        </div>
        {rows.length === 0
            ? (
                <p className={'py-6 text-center text-body text-ink-3'}>
                    {pantryTexts.receiptReview.emptyAfterScan}
                </p>
            )
            : (
                <div className={'flex flex-col gap-2'}>
                    {rows.map((row) => (
                        <ReceiptReviewRow
                            key={row.id}
                            row={row}
                            onToggle={onToggle}
                            onNameChange={onNameChange}
                            onQuantityChange={onQuantityChange}
                            onRemove={onRemove}
                        />
                    ))}
                </div>
            )}
        <Button
            type={'button'}
            disabled={isSubmitting || !rows.some((row) => row.included)}
            onClick={onConfirm}
            className={'w-full'}
        >
            {pantryTexts.receiptReview.confirmButton}
        </Button>
        <Button
            type={'button'}
            variant={'ghost'}
            onClick={onCancel}
            className={'w-full'}
        >
            {pantryTexts.receiptReview.cancelButton}
        </Button>
    </div>
)
