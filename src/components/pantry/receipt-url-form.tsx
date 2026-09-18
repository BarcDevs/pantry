import Link from 'next/link'

import { PrimaryButton } from '@/components/shared/buttons/PrimaryButton'
import { Input } from '@/components/shared/Input'

import { routes } from '@/constants/routes'
import { pantryTexts } from '@/constants/texts/pantry'

import { receiptUrlSchema } from '@/schemas/receipt-url-form'

type ReceiptUrlFormProps = {
    url: string
    onUrlChange: (url: string) => void
    onSubmit: () => void
    isSubmitting: boolean
    error: string | null
}

export const ReceiptUrlForm = ({
    url,
    onUrlChange,
    onSubmit,
    isSubmitting,
    error
}: ReceiptUrlFormProps) => {
    const validation = receiptUrlSchema.safeParse(url)
    const isEmpty = url.trim().length === 0
    const validationError = !isEmpty && !validation.success
        ? validation.error.issues[0].message
        : null

    return (
        <div className={'flex flex-col gap-3 rounded-lg border border-border-2 bg-surface p-5'}>
            <label className={'text-label font-bold text-ink'}>
                {pantryTexts.receiptReview.urlLabel}
            </label>
            <Input
                dir={'ltr'}
                value={url}
                placeholder={pantryTexts.receiptReview.urlPlaceholder}
                onChange={(e) => onUrlChange(e.target.value)}
                className={'text-left'}
            />
            {validationError && (
                <span className={'text-label text-status-red-fg'}>
                    {validationError}
                </span>
            )}
            <PrimaryButton
                disabled={isSubmitting || isEmpty || validationError !== null}
                onClick={onSubmit}
            >
                {isSubmitting
                    ? pantryTexts.receiptReview.scanning
                    : pantryTexts.receiptReview.urlSubmit}
            </PrimaryButton>
            {error && (
                <div className={'flex flex-col gap-2 text-label text-status-red-fg'}>
                    <span>{error}</span>
                    <span>
                        {pantryTexts.receiptReview.urlFallback}
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
}
