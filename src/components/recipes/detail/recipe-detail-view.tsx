'use client'

import type { Recipe } from '@/types/recipe'

import { RecipeDetailActions } from '@/components/recipes/detail/recipe-detail-actions'
import { RecipeRatingDisplay } from '@/components/recipes/detail/recipe-rating-display'
import { RecipeTagsEditor } from '@/components/recipes/detail/recipe-tags-editor'
import { RecipeBodyGrid } from '@/components/recipes/result/recipe-body-grid'
import { RecipeImageUrlField } from '@/components/recipes/result/recipe-image-url-field'
import { RecipeIngredientsList } from '@/components/recipes/result/recipe-ingredients-list'
import { RecipeRefineInput } from '@/components/recipes/result/recipe-refine-input'
import { RecipeResultHero } from '@/components/recipes/result/recipe-result-hero'
import { RecipeResultStats } from '@/components/recipes/result/recipe-result-stats'
import { RecipeStepsList } from '@/components/recipes/result/recipe-steps-list'
import { DeleteRecipeDialog } from '@/components/recipes/shared/delete-recipe-dialog'
import { PageHeader } from '@/components/shared/PageHeader'

import { useRecipeBranch } from '@/hooks/use-recipe-branch'
import { useRecipeDetail } from '@/hooks/use-recipe-detail'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeDetailViewProps = {
    recipe: Recipe
}

export const RecipeDetailView = ({
    recipe: initialRecipe
}: RecipeDetailViewProps) => {
    const recipeDetail = useRecipeDetail(initialRecipe)

    const recipeBranch = useRecipeBranch(recipeDetail.recipe)

    return (
        <div className={'mx-auto w-full max-w-(--breakpoint-lg) px-4 py-6'}>
            <PageHeader/>
            <RecipeResultHero recipe={recipeDetail.recipe}/>
            <RecipeResultStats recipe={recipeDetail.recipe}/>
            <RecipeImageUrlField
                imageUrl={recipeDetail.recipe.imageUrl}
                onChange={recipeDetail.actions.updateImageUrl}
            />
            <RecipeBodyGrid>
                <RecipeIngredientsList
                    ingredients={recipeDetail.recipe.ingredients}
                    usedReplacements={recipeBranch.adjustments.values.usedReplacements}
                    onToggleReplacement={recipeBranch.adjustments.actions.toggleReplacement}
                    usedRemovals={recipeBranch.adjustments.values.usedRemovals}
                    onToggleRemoval={recipeBranch.adjustments.actions.toggleRemoval}
                />
                <RecipeStepsList steps={recipeDetail.recipe.steps}/>
            </RecipeBodyGrid>
            <RecipeRefineInput
                value={recipeBranch.adjustments.values.instruction}
                onChange={(value) => recipeBranch.adjustments.setField('instruction', value)}
                onSubmit={recipeBranch.branch}
                isRefining={recipeBranch.isBranching}
                label={recipesTexts.detail.adjustLabel}
                placeholder={recipesTexts.detail.adjustPlaceholder}
                submitLabel={recipesTexts.detail.adjustSubmit}
                loadingLabel={recipesTexts.detail.adjusting}
            />
            <RecipeRatingDisplay
                rating={recipeDetail.recipe.rating}
                cookCount={recipeDetail.recipe.history.length}
            />
            <RecipeTagsEditor
                tags={recipeDetail.recipe.tags}
                onChange={recipeDetail.actions.updateTags}
            />
            <RecipeDetailActions
                recipe={recipeDetail.recipe}
                onToggleFavorite={recipeDetail.actions.toggleFavorite}
                onStartCooking={recipeDetail.actions.startCooking}
                onRequestDelete={() => recipeDetail.deletion.setIsConfirming(true)}
            />
            <DeleteRecipeDialog
                open={recipeDetail.deletion.isConfirming}
                onOpenChange={recipeDetail.deletion.setIsConfirming}
                onConfirm={recipeDetail.deletion.confirm}
                isDeleting={recipeDetail.deletion.isDeleting}
                recipeName={recipeDetail.recipe.title}
            />
        </div>
    )
}
