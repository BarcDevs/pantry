'use client'

import { RECIPE_SOURCES } from '@/types/enums'

import { RecipeBodyGrid } from '@/components/recipes/result/recipe-body-grid'
import { RecipeDraftDismissButton } from '@/components/recipes/result/recipe-draft-dismiss-button'
import { RecipeImageUrlField } from '@/components/recipes/result/recipe-image-url-field'
import { RecipeIngredientsList } from '@/components/recipes/result/recipe-ingredients-list'
import { RecipeRefineInput } from '@/components/recipes/result/recipe-refine-input'
import { RecipeResultActions } from '@/components/recipes/result/recipe-result-actions'
import { RecipeResultHero } from '@/components/recipes/result/recipe-result-hero'
import { RecipeResultStats } from '@/components/recipes/result/recipe-result-stats'
import { RecipeStepsList } from '@/components/recipes/result/recipe-steps-list'

import { useRecipeResult } from '@/hooks/use-recipe-result'

const showsImageField = (
    source: (typeof RECIPE_SOURCES)[number]
): boolean => source !== 'imported_url'

export const RecipeResultView = () => {
    const recipeResult = useRecipeResult()

    if (!recipeResult.recipe) return null

    return (
        <div className={'mx-auto w-full max-w-(--breakpoint-lg) px-4 py-6'}>
            <RecipeResultHero recipe={recipeResult.recipe}/>
            <RecipeResultStats recipe={recipeResult.recipe}/>
            {showsImageField(recipeResult.recipe.source)
                && !recipeResult.recipe.imageUrl && (
                    <RecipeImageUrlField
                        imageUrl={recipeResult.recipe.imageUrl}
                        onChange={recipeResult.actions.setManualImageUrl}
                    />
                )}
            <RecipeBodyGrid>
                <RecipeIngredientsList
                    ingredients={recipeResult.recipe.ingredients}
                    usedReplacements={recipeResult.adjustments.values.usedReplacements}
                    onToggleReplacement={recipeResult.adjustments.actions.toggleReplacement}
                    usedRemovals={recipeResult.adjustments.values.usedRemovals}
                    onToggleRemoval={recipeResult.adjustments.actions.toggleRemoval}
                />
                <RecipeStepsList steps={recipeResult.recipe.steps}/>
            </RecipeBodyGrid>
            <RecipeRefineInput
                value={recipeResult.adjustments.values.instruction}
                onChange={(value) => recipeResult.adjustments.setField('instruction', value)}
                onSubmit={recipeResult.actions.refine}
                isRefining={recipeResult.status.isRefining}
            />
            <RecipeResultActions
                recipe={recipeResult.recipe}
                isSaved={recipeResult.status.savedRecipeId !== null}
                isSaving={recipeResult.status.isSaving}
                onToggleFavorite={recipeResult.actions.toggleFavorite}
                onSave={() => recipeResult.actions.save()}
                onStartCooking={recipeResult.actions.startCooking}
            />
            {recipeResult.status.savedRecipeId === null && (
                <RecipeDraftDismissButton onDismiss={recipeResult.actions.dismiss}/>
            )}
        </div>
    )
}
