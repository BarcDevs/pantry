import { pantryTexts } from '@/constants/texts/pantry'

type PantryStatCardsProps = {
    itemCount: number
    expiringSoonCount: number
}

export const PantryStatCards = ({
    itemCount,
    expiringSoonCount
}: PantryStatCardsProps) => (
    <div className={'mb-4 grid grid-cols-2 gap-3'}>
        <div className={'rounded-2xl border border-border bg-surface p-4'}>
            <div className={'font-display text-title font-weight-title'}>
                {itemCount}
            </div>
            <div className={'text-label text-ink-3'}>
                {pantryTexts.statItemsInStock}
            </div>
        </div>
        <div className={'rounded-2xl border border-border bg-surface p-4'}>
            <div className={'font-display text-title font-weight-title text-status-red-fg'}>
                {expiringSoonCount}
            </div>
            <div className={'text-label text-ink-3'}>
                {pantryTexts.statExpiringSoon}
            </div>
        </div>
    </div>
)
