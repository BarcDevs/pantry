'use client'

import type { RecipeDoc } from '@/types/recipe'

import { RecipeRetryButton } from '@/components/recipes/result/recipe-retry-button'
import { RecipeFavoriteButton } from '@/components/recipes/shared/recipe-favorite-button'
import { OutlinedActionButton } from '@/components/shared/buttons/OutlinedActionButton'
import { PrimaryButton } from '@/components/shared/buttons/PrimaryButton'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeResultActionsProps = {
    recipe: RecipeDoc
    isSaved: boolean
    isSaving: boolean
    retry: {
        isAvailable: boolean
        isRetrying: boolean
        onRetry: () => void
    }
    onToggleFavorite: () => void
    onSave: () => void
    onStartCooking: () => void
}

export const RecipeResultActions = ({
    recipe,
    isSaved,
    isSaving,
    retry,
    onToggleFavorite,
    onSave,
    onStartCooking
}: RecipeResultActionsProps) => {
    const texts = recipesTexts.result

    return (
        <div className={'mt-4.5 flex flex-col gap-2.75'}>
            <div className={'flex gap-2.75'}>
                {retry.isAvailable && (
                    <RecipeRetryButton
                        isRetrying={retry.isRetrying}
                        isDisabled={isSaving}
                        onRetry={retry.onRetry}
                    />
                )}
                <OutlinedActionButton
                    onClick={onSave}
                    disabled={isSaving || isSaved || retry.isRetrying}
                    className={'flex-1'}
                >
                    {isSaved
                        ? texts.saved
                        : isSaving
                            ? texts.saving
                            : texts.save}
                </OutlinedActionButton>
            </div>
            <div className={'flex gap-2.75'}>
                <RecipeFavoriteButton
                    recipe={recipe}
                    onToggle={onToggleFavorite}
                />
                <PrimaryButton
                    onClick={onStartCooking}
                    disabled={isSaving || retry.isRetrying}
                    className={'flex-1'}
                >
                    {texts.startCooking}
                </PrimaryButton>
            </div>
        </div>
    )
}
