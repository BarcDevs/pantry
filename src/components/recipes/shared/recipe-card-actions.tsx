import { Trash2Icon } from 'lucide-react'

import { RecipeHeartToggle } from '@/components/recipes/shared/recipe-heart-toggle'
import { Button } from '@/components/shared/Button'
import { Checkbox } from '@/components/ui/checkbox'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeCardActionsProps = {
    isFavorite: boolean
    onToggleFavorite: () => void
    onRequestDelete: () => void
    isSelecting: boolean
    isSelected: boolean
    onToggleSelect: () => void
}

export const RecipeCardActions = ({
    isFavorite,
    onToggleFavorite,
    onRequestDelete,
    isSelecting,
    isSelected,
    onToggleSelect
}: RecipeCardActionsProps) => (
    isSelecting ? (
        <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect()}
            onClick={(e) => e.preventDefault()}
            className={'size-6 rounded-full border-none bg-surface/90'}
        />
    ) : (
        <div className={'flex gap-1.5'}>
            <RecipeHeartToggle
                isFavorite={isFavorite}
                onToggle={onToggleFavorite}
                className={'bg-surface/90'}
            />
            <Button
                variant={'ghost'}
                aria-label={recipesTexts.detail.deleteButton}
                onClick={(e) => {
                    e.preventDefault()
                    onRequestDelete()
                }}
                className={'flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-surface/90 p-0'}
            >
                <Trash2Icon
                    size={17}
                    className={'stroke-status-red-fg'}
                />
            </Button>
        </div>
    )
)
