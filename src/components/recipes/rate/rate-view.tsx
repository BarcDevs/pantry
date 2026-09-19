'use client'

import type { Recipe } from '@/types/recipe'

import { RateAutoSaveNote } from '@/components/recipes/rate/rate-auto-save-note'
import { RateFinishButton } from '@/components/recipes/rate/rate-finish-button'
import { RateHeader } from '@/components/recipes/rate/rate-header'
import { RateStars } from '@/components/recipes/rate/rate-stars'

import { useRateRecipe } from '@/hooks/use-rate-recipe'

type RateViewProps = {
    recipe: Recipe
}

export const RateView = ({ recipe }: RateViewProps) => {
    const rateRecipe = useRateRecipe(recipe._id)

    return (
        <div className={'mx-auto max-w-screen-sm px-4 py-8'}>
            <RateHeader
                emoji={recipe.emoji}
                title={recipe.title}
            />
            <RateStars
                rating={rateRecipe.rating}
                hoverRating={rateRecipe.hoverRating}
                onRate={rateRecipe.setRating}
                onHover={rateRecipe.setHoverRating}
                onHoverEnd={() => rateRecipe.setHoverRating(0)}
            />
            <RateAutoSaveNote/>
            <RateFinishButton
                rating={rateRecipe.rating}
                isSubmitting={rateRecipe.isSubmitting}
                onClick={rateRecipe.finishRate}
            />
        </div>
    )
}
