import Link from 'next/link'

import { PrimaryButton } from '@/components/shared/buttons/PrimaryButton'
import { Textarea } from '@/components/ui/textarea'

import { routes } from '@/constants/routes'
import { pantryTexts } from '@/constants/texts/pantry'

type ReceiptTextFormProps = {
    text: string
    onTextChange: (text: string) => void
    onSubmit: () => void
    isSubmitting: boolean
    error: string | null
}

export const ReceiptTextForm = ({
    text,
    onTextChange,
    onSubmit,
    isSubmitting,
    error
}: ReceiptTextFormProps) => (
    <div className={'flex flex-col gap-3 rounded-lg border border-border-2 bg-surface p-5'}>
        <label className={'text-label font-bold text-ink'}>
            {pantryTexts.receiptReview.pasteTextLabel}
        </label>
        <Textarea
            value={text}
            placeholder={pantryTexts.receiptReview.pasteTextPlaceholder}
            onChange={(e) => onTextChange(e.target.value)}
            className={'min-h-40'}
        />
        <PrimaryButton
            disabled={isSubmitting || text.trim().length === 0}
            onClick={onSubmit}
        >
            {isSubmitting
                ? pantryTexts.receiptReview.scanning
                : pantryTexts.receiptReview.pasteSubmit}
        </PrimaryButton>
        {error && (
            <div className={'flex flex-col gap-2 text-label text-status-red-fg'}>
                <span>{error}</span>
                <span>
                    {pantryTexts.receiptReview.textFallback}
                </span>
                <Link
                    href={routes.add}
                    className={'font-bold text-green underline'}
                >
                    {pantryTexts.receiptReview.manualEntryLink}
                </Link>
            </div>
        )}
    </div>
)
