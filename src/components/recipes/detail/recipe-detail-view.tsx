'use client'

import { RECIPE_SOURCES } from '@/types/enums'
import type { Recipe } from '@/types/recipe'

import { RecipeDetailActions } from '@/components/recipes/detail/recipe-detail-actions'
import { RecipeRatingDisplay } from '@/components/recipes/detail/recipe-rating-display'
import { RecipeTagsEditor } from '@/components/recipes/detail/recipe-tags-editor'
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

export const RecipeDetailView = ({ recipe: initialRecipe }: RecipeDetailViewProps) => {
    const {
        recipe,
        toggleFavorite,
        updateTags,
        updateImageUrl,
        startCooking,
        confirmDelete,
        setConfirmDelete,
        isDeleting,
        handleDelete
    } = useRecipeDetail(initialRecipe)

    const {
        instruction: adjustInstruction,
        setInstruction: setAdjustInstruction,
        usedReplacements,
        toggleReplacement,
        usedRemovals,
        toggleRemoval,
        isBranching,
        branch
    } = useRecipeBranch(recipe)

    return (
        <div className={'mx-auto w-full max-w-(--breakpoint-lg) px-4 py-6'}>
            <PageHeader/>
            <RecipeResultHero recipe={recipe}/>
            <RecipeResultStats recipe={recipe}/>
            {showsImageField(recipe.source) && !recipe.imageUrl && (
                <RecipeImageUrlField
                    imageUrl={recipe.imageUrl}
                    onChange={updateImageUrl}
                />
            )}
            <div className={'grid grid-cols-1 gap-5.5 md:grid-cols-2'}>
                <RecipeIngredientsList
                    ingredients={recipe.ingredients}
                    usedReplacements={usedReplacements}
                    onToggleReplacement={toggleReplacement}
                    usedRemovals={usedRemovals}
                    onToggleRemoval={toggleRemoval}
                />
                <RecipeStepsList steps={recipe.steps}/>
            </div>
            <RecipeRefineInput
                value={adjustInstruction}
                onChange={setAdjustInstruction}
                onSubmit={branch}
                isRefining={isBranching}
                label={recipesTexts.detail.adjustLabel}
                placeholder={recipesTexts.detail.adjustPlaceholder}
                submitLabel={recipesTexts.detail.adjustSubmit}
                loadingLabel={recipesTexts.detail.adjusting}
            />
            <RecipeRatingDisplay
                rating={recipe.rating}
                cookCount={recipe.history.length}
            />
            <RecipeTagsEditor
                tags={recipe.tags}
                onChange={updateTags}
            />
            <RecipeDetailActions
                recipe={recipe}
                onToggleFavorite={toggleFavorite}
                onStartCooking={startCooking}
                onRequestDelete={() => setConfirmDelete(true)}
            />
            <DeleteRecipeDialog
                open={confirmDelete}
                onOpenChange={setConfirmDelete}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
            />
        </div>
    )
}
