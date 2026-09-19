'use client'

import { RECIPE_SOURCES } from '@/types/enums'
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

const showsImageField = (
    source: (typeof RECIPE_SOURCES)[number]
): boolean => source !== 'imported_url'

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
            {showsImageField(recipeDetail.recipe.source)
                && !recipeDetail.recipe.imageUrl && (
                    <RecipeImageUrlField
                        imageUrl={recipeDetail.recipe.imageUrl}
                        onChange={recipeDetail.updateImageUrl}
                    />
                )}
            <RecipeBodyGrid>
                <RecipeIngredientsList
                    ingredients={recipeDetail.recipe.ingredients}
                    usedReplacements={recipeBranch.usedReplacements}
                    onToggleReplacement={recipeBranch.toggleReplacement}
                    usedRemovals={recipeBranch.usedRemovals}
                    onToggleRemoval={recipeBranch.toggleRemoval}
                />
                <RecipeStepsList steps={recipeDetail.recipe.steps}/>
            </RecipeBodyGrid>
            <RecipeRefineInput
                value={recipeBranch.instruction}
                onChange={recipeBranch.setInstruction}
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
                onChange={recipeDetail.updateTags}
            />
            <RecipeDetailActions
                recipe={recipeDetail.recipe}
                onToggleFavorite={recipeDetail.toggleFavorite}
                onStartCooking={recipeDetail.startCooking}
                onRequestDelete={() => recipeDetail.setConfirmDelete(true)}
            />
            <DeleteRecipeDialog
                open={recipeDetail.confirmDelete}
                onOpenChange={recipeDetail.setConfirmDelete}
                onConfirm={recipeDetail.handleDelete}
                isDeleting={recipeDetail.isDeleting}
                recipeName={recipeDetail.recipe.title}
            />
        </div>
    )
}
