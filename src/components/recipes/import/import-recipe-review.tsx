import type { RecipeDoc } from '@/types/recipe'

import { RecipeBodyGrid } from '@/components/recipes/result/recipe-body-grid'
import { RecipeDraftDismissButton } from '@/components/recipes/result/recipe-draft-dismiss-button'
import { RecipeIngredientsList } from '@/components/recipes/result/recipe-ingredients-list'
import { RecipeRefineInput } from '@/components/recipes/result/recipe-refine-input'
import { RecipeResultHero } from '@/components/recipes/result/recipe-result-hero'
import { RecipeStepsList } from '@/components/recipes/result/recipe-steps-list'
import { PrimaryButton } from '@/components/shared/buttons/PrimaryButton'
import { Input } from '@/components/shared/Input'

import type { useRecipeAdjustments } from '@/hooks/use-recipe-adjustments'

import { recipesTexts } from '@/constants/texts/recipes'

type ImportRecipeReviewProps = {
    recipe: RecipeDoc
    isSaving: boolean
    onTitleChange: (title: string) => void
    onSave: () => void
    adjustments: ReturnType<typeof useRecipeAdjustments>
    isRefining: boolean
    onRefine: () => void
    onDismiss: () => void
}

export const ImportRecipeReview = ({
    recipe,
    isSaving,
    onTitleChange,
    onSave,
    adjustments,
    isRefining,
    onRefine,
    onDismiss
}: ImportRecipeReviewProps) => (
    <div className={'flex flex-col gap-5'}>
        <RecipeResultHero recipe={recipe}/>
        <div className={'flex flex-col gap-2'}>
            <label className={'text-label font-bold text-ink'}>
                {recipesTexts.import.titleLabel}
            </label>
            <Input
                value={recipe.title}
                onChange={(e) => onTitleChange(e.target.value)}
                onEnter={isSaving ? undefined : onSave}
            />
        </div>
        <RecipeBodyGrid>
            <RecipeIngredientsList
                ingredients={recipe.ingredients}
                usedReplacements={adjustments.usedReplacements}
                onToggleReplacement={adjustments.toggleReplacement}
                usedRemovals={adjustments.usedRemovals}
                onToggleRemoval={adjustments.toggleRemoval}
            />
            <RecipeStepsList steps={recipe.steps}/>
        </RecipeBodyGrid>
        <RecipeRefineInput
            value={adjustments.instruction}
            onChange={adjustments.setInstruction}
            onSubmit={onRefine}
            isRefining={isRefining}
        />
        <PrimaryButton
            disabled={isSaving}
            onClick={onSave}
        >
            {isSaving
                ? recipesTexts.import.importing
                : recipesTexts.import.save}
        </PrimaryButton>
        <RecipeDraftDismissButton onDismiss={onDismiss}/>
    </div>
)
