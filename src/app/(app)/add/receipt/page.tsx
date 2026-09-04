'use client'

import { ItemSource } from '@/types/enums'

import { ReceiptReviewShell } from '@/components/pantry/receipt-review-shell'
import { ReceiptUpload } from '@/components/pantry/receipt-upload'

import { pantryTexts } from '@/constants/texts/pantry'

const AddReceiptPage = () => (
    <ReceiptReviewShell
        title={pantryTexts.receiptReview.title}
        source={ItemSource.ReceiptScan}
    >
        {({ onScanned }) => <ReceiptUpload onScanned={onScanned}/>}
    </ReceiptReviewShell>
)

export default AddReceiptPage
