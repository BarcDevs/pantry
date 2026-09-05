'use client'

import type { RecipeDoc } from '@/types/recipe'

import { RecipeFavoriteButton } from '@/components/recipes/shared/recipe-favorite-button'
import { Button } from '@/components/shared/Button'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeDetailActionsProps = {
    recipe: RecipeDoc
    onToggleFavorite: () => void
    onStartCooking: () => void
    onRequestDelete: () => void
}

export const RecipeDetailActions = ({
    recipe,
    onToggleFavorite,
    onStartCooking,
    onRequestDelete
}: RecipeDetailActionsProps) => (
    <div className={'mt-4.5 flex flex-col gap-2.75'}>
        <div className={'flex gap-2.75'}>
            <RecipeFavoriteButton
                recipe={recipe}
                onToggle={onToggleFavorite}
                className={'shrink-0'}
            />
            <Button
                onClick={onStartCooking}
                className={'flex-1'}
            >
                {recipesTexts.detail.startCooking}
            </Button>
        </div>
        <Button
            variant={'destructive'}
            onClick={onRequestDelete}
        >
            {recipesTexts.detail.deleteButton}
        </Button>
    </div>
)
