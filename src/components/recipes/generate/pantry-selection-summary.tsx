import { Button } from '@/components/shared/buttons/Button'

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
        <Button
            variant={'ghost'}
            onClick={onEdit}
            className={'flex h-auto w-full items-center justify-between rounded-lg border border-border-2 bg-surface p-4 text-start'}
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
        </Button>
    )
}
