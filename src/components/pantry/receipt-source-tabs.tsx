import { Button } from '@/components/shared/Button'

import { pantryTexts } from '@/constants/texts/pantry'

type ReceiptSourceTabsProps = {
    tab: 'url' | 'text'
    onChange: (tab: 'url' | 'text') => void
}

export const ReceiptSourceTabs = ({
    tab,
    onChange
}: ReceiptSourceTabsProps) => (
    <div className={'flex gap-2'}>
        <Button
            type={'button'}
            variant={tab === 'url' ? 'default' : 'outline'}
            onClick={() => onChange('url')}
        >
            {pantryTexts.receiptReview.urlTab}
        </Button>
        <Button
            type={'button'}
            variant={tab === 'text' ? 'default' : 'outline'}
            onClick={() => onChange('text')}
        >
            {pantryTexts.receiptReview.textTab}
        </Button>
    </div>
)
