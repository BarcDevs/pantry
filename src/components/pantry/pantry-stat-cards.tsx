import { pantryTexts } from '@/constants/texts/pantry'

type PantryStatCardsProps = {
    itemCount: number
    expiringSoonCount: number
    savedRecipesCount: number
}

export const PantryStatCards = ({
    itemCount,
    expiringSoonCount,
    savedRecipesCount
}: PantryStatCardsProps) => (
    <div className={'mb-4 grid grid-cols-3 gap-3'}>
        <div className={'rounded-lg border border-border-2 bg-surface p-4'}>
            <div className={'font-display text-title font-weight-title'}>
                {itemCount}
            </div>
            <div className={'text-label text-ink-3'}>
                {pantryTexts.statItemsInStock}
            </div>
        </div>
        <div className={'rounded-lg border border-warning-border bg-surface p-4'}>
            <div className={'font-display text-title font-weight-title text-status-red-fg'}>
                {expiringSoonCount}
            </div>
            <div className={'text-label text-ink-3'}>
                {pantryTexts.statExpiringSoon}
            </div>
        </div>
        <div className={'rounded-lg border border-border-2 bg-surface p-4'}>
            <div className={'font-display text-title font-weight-title'}>
                {savedRecipesCount}
            </div>
            <div className={'text-label text-ink-3'}>
                {pantryTexts.statSavedRecipes}
            </div>
        </div>
    </div>
)
