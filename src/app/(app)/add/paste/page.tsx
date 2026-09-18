import { Suspense } from 'react'

import { ReceiptPasteView } from '@/components/pantry/receipt-paste-view'

const AddPastePage = () => (
    <Suspense>
        <ReceiptPasteView/>
    </Suspense>
)

export default AddPastePage
