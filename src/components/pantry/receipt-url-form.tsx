import Link from 'next/link'

import { ReceiptUrlBlockedNotice } from '@/components/pantry/receipt-url-blocked-notice'
import { PrimaryButton } from '@/components/shared/buttons/PrimaryButton'
import { UrlInput } from '@/components/shared/UrlInput'

import { isUrlInputInvalid } from '@/lib/network/parse-url-input'

import { routes } from '@/constants/routes'
import { pantryTexts } from '@/constants/texts/pantry'

type ReceiptUrlFormProps = {
    url: string
    onUrlChange: (url: string) => void
    onSubmit: () => void
    isSubmitting: boolean
    error: string | null
    isBlocked?: boolean
}

export const ReceiptUrlForm = ({
    url,
    onUrlChange,
    onSubmit,
    isSubmitting,
    error,
    isBlocked = false
}: ReceiptUrlFormProps) => {
    const isEmpty = url.trim().length === 0
    const canSubmit = !isSubmitting && !isEmpty && !isUrlInputInvalid(url)

    return (
        <div className={'flex flex-col gap-3 rounded-lg border border-border-2 bg-surface p-5'}>
            <label className={'text-label font-bold text-ink'}>
                {pantryTexts.receiptReview.urlLabel}
            </label>
            <UrlInput
                value={url}
                placeholder={pantryTexts.receiptReview.urlPlaceholder}
                onChange={(e) => onUrlChange(e.target.value)}
                onEnter={canSubmit ? onSubmit : undefined}
            />
            <PrimaryButton
                disabled={!canSubmit}
                onClick={onSubmit}
            >
                {isSubmitting
                    ? pantryTexts.receiptReview.scanning
                    : pantryTexts.receiptReview.urlSubmit}
            </PrimaryButton>
            {error && isBlocked && <ReceiptUrlBlockedNotice/>}
            {error && !isBlocked && (
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
