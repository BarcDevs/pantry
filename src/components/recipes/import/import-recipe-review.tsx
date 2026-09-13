import type { RecipeDoc } from '@/types/recipe'

import { RecipeIngredientsList } from '@/components/recipes/result/recipe-ingredients-list'
import { RecipeResultHero } from '@/components/recipes/result/recipe-result-hero'
import { RecipeStepsList } from '@/components/recipes/result/recipe-steps-list'
import { Button } from '@/components/shared/buttons/Button'
import { Input } from '@/components/shared/Input'

import { recipesTexts } from '@/constants/texts/recipes'

type ImportRecipeReviewProps = {
    recipe: RecipeDoc
    isSaving: boolean
    onTitleChange: (title: string) => void
    onSave: () => void
}

export const ImportRecipeReview = ({
    recipe,
    isSaving,
    onTitleChange,
    onSave
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
            />
        </div>
        <RecipeIngredientsList ingredients={recipe.ingredients}/>
        <RecipeStepsList steps={recipe.steps}/>
        <Button
            disabled={isSaving}
            onClick={onSave}
        >
            {isSaving
                ? recipesTexts.import.importing
                : recipesTexts.import.save}
        </Button>
    </div>
)
