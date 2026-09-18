import type {
    ReceiptReviewRow as Row,
    ReceiptReviewRowActions
} from '@/types/receipt-review-row'

import { ReceiptReviewRow } from '@/components/pantry/receipt-review-row'
import { PrimaryButton } from '@/components/shared/buttons/PrimaryButton'
import { TextButton } from '@/components/shared/buttons/TextButton'

import { pantryTexts } from '@/constants/texts/pantry'

type ReceiptReviewListProps = {
    rows: Row[]
    isSubmitting: boolean
    rowActions: ReceiptReviewRowActions
    onConfirm: () => void
    onCancel: () => void
}

export const ReceiptReviewList = ({
    rows,
    isSubmitting,
    rowActions,
    onConfirm,
    onCancel
}: ReceiptReviewListProps) => (
    <div className={'flex flex-col gap-4'}>
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
                            actions={rowActions}
                        />
                    ))}
                </div>
            )}
        <PrimaryButton
            disabled={isSubmitting || !rows.some((row) => row.included)}
            onClick={onConfirm}
            className={'w-full'}
        >
            {pantryTexts.receiptReview.confirmButton}
        </PrimaryButton>
        <TextButton
            tone={'ink'}
            onClick={onCancel}
            className={'w-full justify-center'}
        >
            {pantryTexts.receiptReview.cancelButton}
        </TextButton>
    </div>
)
