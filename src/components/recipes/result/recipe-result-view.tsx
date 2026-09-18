'use client'

import { RECIPE_SOURCES } from '@/types/enums'

import { RecipeBodyGrid } from '@/components/recipes/result/recipe-body-grid'
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
    const {
        recipe,
        savedRecipeId,
        refineInstruction,
        setRefineInstruction,
        usedReplacements,
        toggleReplacement,
        usedRemovals,
        toggleRemoval,
        isRefining,
        refine,
        toggleFavorite,
        setManualImageUrl,
        isSaving,
        save,
        startCooking
    } = useRecipeResult()

    if (!recipe) return null

    return (
        <div className={'mx-auto w-full max-w-(--breakpoint-lg) px-4 py-6'}>
            <RecipeResultHero recipe={recipe}/>
            <RecipeResultStats recipe={recipe}/>
            {showsImageField(recipe.source) && !recipe.imageUrl && (
                <RecipeImageUrlField
                    imageUrl={recipe.imageUrl}
                    onChange={setManualImageUrl}
                />
            )}
            <RecipeBodyGrid>
                <RecipeIngredientsList
                    ingredients={recipe.ingredients}
                    usedReplacements={usedReplacements}
                    onToggleReplacement={toggleReplacement}
                    usedRemovals={usedRemovals}
                    onToggleRemoval={toggleRemoval}
                />
                <RecipeStepsList steps={recipe.steps}/>
            </RecipeBodyGrid>
            <RecipeRefineInput
                value={refineInstruction}
                onChange={setRefineInstruction}
                onSubmit={refine}
                isRefining={isRefining}
            />
            <RecipeResultActions
                recipe={recipe}
                isSaved={savedRecipeId !== null}
                isSaving={isSaving}
                onToggleFavorite={toggleFavorite}
                onSave={() => save()}
                onStartCooking={startCooking}
            />
        </div>
    )
}
