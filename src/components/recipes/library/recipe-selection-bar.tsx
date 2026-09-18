import { Trash2Icon } from 'lucide-react'

import { DestructiveButton } from '@/components/shared/buttons/DestructiveButton'
import { SecondaryButton } from '@/components/shared/buttons/SecondaryButton'

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
                <SecondaryButton onClick={onToggleSelectMode}>
                    {recipesTexts.library.cancelSelect}
                </SecondaryButton>
                <DestructiveButton
                    disabled={selectedCount === 0}
                    onClick={onRequestDelete}
                >
                    <Trash2Icon size={16}/>
                    {recipesTexts.library.deleteSelected}
                </DestructiveButton>
            </div>
        </div>
    ) : (
        <SecondaryButton
            onClick={onToggleSelectMode}
            className={'mb-4.5'}
        >
            {recipesTexts.library.selectButton}
        </SecondaryButton>
    )
)
