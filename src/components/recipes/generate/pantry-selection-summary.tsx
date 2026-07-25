import { Button } from '@/components/shared/Button'

import { recipesTexts } from '@/constants/texts/recipes'

type PantrySelectionSummaryProps = {
    selectedCount: number
    onEdit: () => void
}

export const PantrySelectionSummary = ({
    selectedCount,
    onEdit
}: PantrySelectionSummaryProps) => (
    <div className={'flex items-center justify-between rounded-lg border border-border px-4 py-3'}>
        <span className={'text-body text-ink'}>
            {`${recipesTexts.generate.pantrySelectionCount}: ${selectedCount}`}
        </span>
        <Button
            variant={'ghost'}
            onClick={onEdit}
        >
            {recipesTexts.generate.pantrySelectionEdit}
        </Button>
    </div>
)
