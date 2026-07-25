'use client'

import type { RecipeDoc } from '@/types/recipe'

import { Button } from '@/components/shared/Button'

import { cn } from '@/lib/utils'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeResultActionsProps = {
    recipe: RecipeDoc
    isSaved: boolean
    isSaving: boolean
    onToggleFavorite: () => void
    onSave: () => void
    onStartCooking: () => void
}

export const RecipeResultActions = ({
    recipe,
    isSaved,
    isSaving,
    onToggleFavorite,
    onSave,
    onStartCooking
}: RecipeResultActionsProps) => {
    const texts = recipesTexts.result

    return (
        <div className={'mt-4.5 flex flex-col gap-2.75'}>
            <div className={'flex gap-2.75'}>
                <Button
                    variant={'outline'}
                    onClick={onToggleFavorite}
                    className={cn(
                        'flex-1',
                        recipe.isFavorite && 'border-green bg-green/10 text-ink-green'
                    )}
                >
                    {recipe.isFavorite ? texts.favoriteOn : texts.favoriteOff}
                </Button>
                <Button
                    variant={'outline'}
                    onClick={onSave}
                    disabled={isSaving || isSaved}
                    className={'flex-1'}
                >
                    {isSaved ? texts.saved : (isSaving ? texts.saving : texts.save)}
                </Button>
            </div>
            <Button
                onClick={onStartCooking}
                disabled={isSaving}
                className={'w-full'}
            >
                {texts.startCooking}
            </Button>
        </div>
    )
}
