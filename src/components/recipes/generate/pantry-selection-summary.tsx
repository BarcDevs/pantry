import { SurfaceButton } from '@/components/shared/buttons/SurfaceButton'

import { recipesTexts } from '@/constants/texts/recipes'

type PantrySelectionSummaryProps = {
    selectedCount: number
    totalCount: number
    onEdit: () => void
}

export const PantrySelectionSummary = ({
    selectedCount,
    totalCount,
    onEdit
}: PantrySelectionSummaryProps) => {
    const texts = recipesTexts.generate
    const summary = (totalCount > 0 && selectedCount === totalCount)
        ? texts.pantrySelectionAll(totalCount)
        : texts.pantrySelectionPartial(selectedCount, totalCount)

    return (
        <SurfaceButton
            onClick={onEdit}
            className={'flex items-center justify-between rounded-lg border border-border-2 bg-surface p-4'}
        >
            <div className={'flex flex-col gap-0.5'}>
                <span className={'font-bold text-body text-ink'}>
                    {texts.pantrySelectionTitle}
                </span>
                <span className={'text-caption text-ink-3'}>
                    {summary}
                </span>
            </div>
            <span className={'font-semibold text-body text-green'}>
                {texts.pantrySelectionEdit}
            </span>
        </SurfaceButton>
    )
}
