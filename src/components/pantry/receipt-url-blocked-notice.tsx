import Link from 'next/link'

import { routes } from '@/constants/routes'
import { pantryTexts } from '@/constants/texts/pantry'

export const ReceiptUrlBlockedNotice = () => (
    <div className={'text-label text-status-red-fg'}>
        {`${pantryTexts.receiptReview.urlBlockedError}. ${pantryTexts.receiptReview.urlBlockedHintPrefix} `}
        <Link
            href={`${routes.addPaste}?tab=text`}
            className={'font-bold underline'}
        >
            {pantryTexts.receiptReview.urlBlockedHintLink}
        </Link>
    </div>
)
