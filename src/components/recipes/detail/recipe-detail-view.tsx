'use client'

import { RECIPE_SOURCES } from '@/types/enums'
import type { Recipe } from '@/types/recipe'

import { DeleteRecipeDialog } from '@/components/recipes/detail/delete-recipe-dialog'
import { RecipeDetailActions } from '@/components/recipes/detail/recipe-detail-actions'
import { RecipeRatingDisplay } from '@/components/recipes/detail/recipe-rating-display'
import { RecipeTagsEditor } from '@/components/recipes/detail/recipe-tags-editor'
import { RecipeImageUrlField } from '@/components/recipes/result/recipe-image-url-field'
import { RecipeIngredientsList } from '@/components/recipes/result/recipe-ingredients-list'
import { RecipeResultHero } from '@/components/recipes/result/recipe-result-hero'
import { RecipeResultStats } from '@/components/recipes/result/recipe-result-stats'
import { RecipeStepsList } from '@/components/recipes/result/recipe-steps-list'
import { PageHeader } from '@/components/shared/PageHeader'

import { useRecipeDetail } from '@/hooks/use-recipe-detail'

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
                <RecipeIngredientsList ingredients={recipe.ingredients}/>
                <RecipeStepsList steps={recipe.steps}/>
            </div>
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
