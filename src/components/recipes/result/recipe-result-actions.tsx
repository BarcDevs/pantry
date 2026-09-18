'use client'

import type { RecipeDoc } from '@/types/recipe'

import { RecipeFavoriteButton } from '@/components/recipes/shared/recipe-favorite-button'
import { PrimaryButton } from '@/components/shared/buttons/PrimaryButton'
import { SecondaryButton } from '@/components/shared/buttons/SecondaryButton'

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
                <RecipeFavoriteButton
                    recipe={recipe}
                    onToggle={onToggleFavorite}
                    className={'flex-1'}
                />
                <SecondaryButton
                    onClick={onSave}
                    disabled={isSaving || isSaved}
                    className={'flex-1'}
                >
                    {isSaved
                        ? texts.saved
                        : isSaving
                            ? texts.saving
                            : texts.save}
                </SecondaryButton>
            </div>
            <PrimaryButton
                onClick={onStartCooking}
                disabled={isSaving}
                className={'w-full'}
            >
                {texts.startCooking}
            </PrimaryButton>
        </div>
    )
}
