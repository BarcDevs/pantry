import Link from 'next/link'

import { routes } from '@/constants/routes'
import { pantryTexts } from '@/constants/texts/pantry'

export const ReceiptUrlBlockedNotice = () => (
    <div className={'flex flex-col gap-2 text-label text-status-red-fg'}>
        <span>
            {pantryTexts.receiptReview.urlBlockedError}
        </span>
        <span className={'text-ink-3'}>
            {`${pantryTexts.receiptReview.urlBlockedHintPrefix} `}
            <Link
                href={`${routes.addPaste}?tab=text`}
                className={'font-bold text-green underline'}
            >
                {pantryTexts.receiptReview.urlBlockedHintLink}
            </Link>
        </span>
    </div>
)
