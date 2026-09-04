import { SourceTabs } from '@/components/shared/SourceTabs'

import { pantryTexts } from '@/constants/texts/pantry'

type ReceiptSourceTabsProps = {
    tab: 'url' | 'text'
    onChange: (tab: 'url' | 'text') => void
}

export const ReceiptSourceTabs = ({
    tab,
    onChange
}: ReceiptSourceTabsProps) => (
    <SourceTabs
        tab={tab}
        urlLabel={pantryTexts.receiptReview.urlTab}
        textLabel={pantryTexts.receiptReview.textTab}
        onChange={onChange}
    />
)
