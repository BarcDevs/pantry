import { Trash2Icon } from 'lucide-react'

import { Button } from '@/components/shared/Button'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeSelectionBarProps = {
    isSelecting: boolean
    selectedCount: number
    onToggleSelectMode: () => void
    onRequestDelete: () => void
}

export const RecipeSelectionBar = ({
    isSelecting,
    selectedCount,
    onToggleSelectMode,
    onRequestDelete
}: RecipeSelectionBarProps) => (
    isSelecting ? (
        <div className={'mb-4.5 flex items-center justify-between gap-2 rounded-lg border border-border-2 bg-surface p-2.5'}>
            <span className={'text-caption font-bold text-ink-3'}>
                {recipesTexts.library.selectedCount(selectedCount)}
            </span>
            <div className={'flex items-center gap-2'}>
                <Button
                    variant={'outline'}
                    onClick={onToggleSelectMode}
                >
                    {recipesTexts.library.cancelSelect}
                </Button>
                <Button
                    variant={'destructive'}
                    disabled={selectedCount === 0}
                    onClick={onRequestDelete}
                >
                    <Trash2Icon size={16}/>
                    {recipesTexts.library.deleteSelected}
                </Button>
            </div>
        </div>
    ) : (
        <Button
            variant={'outline'}
            onClick={onToggleSelectMode}
            className={'mb-4.5'}
        >
            {recipesTexts.library.selectButton}
        </Button>
    )
)
