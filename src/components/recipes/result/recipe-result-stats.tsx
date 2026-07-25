import type { RecipeDoc } from '@/types/recipe'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeResultStatsProps = {
    recipe: RecipeDoc
}

const pantryMatchPercent = (recipe: RecipeDoc): number => {
    if (recipe.ingredients.length === 0) return 0
    const inPantryCount = recipe.ingredients.filter(
        (ingredient) => ingredient.inPantry
    ).length
    return Math.round(
        (inPantryCount / recipe.ingredients.length) * 100
    )
}

export const RecipeResultStats = ({ recipe }: RecipeResultStatsProps) => (
    <div className={'mb-5 grid grid-cols-3 gap-2.5'}>
        <div className={'rounded-lg border border-border bg-surface p-3.25 text-center'}>
            <div className={'font-display text-heading font-weight-heading text-ink'}>
                {recipe.mealCount}
            </div>
            <div className={'text-caption text-ink-3'}>
                {recipesTexts.result.servingsLabel}
            </div>
        </div>
        <div className={'rounded-lg border border-border bg-surface p-3.25 text-center'}>
            <div className={'font-display text-heading font-weight-heading text-ink'}>
                {recipe.steps.length}
            </div>
            <div className={'text-caption text-ink-3'}>
                {recipesTexts.result.stepsLabel}
            </div>
        </div>
        <div className={'rounded-lg border border-border bg-surface p-3.25 text-center'}>
            <div className={'font-display text-heading font-weight-heading text-ink-green'}>
                {`${pantryMatchPercent(recipe)}%`}
            </div>
            <div className={'text-caption text-ink-3'}>
                {recipesTexts.result.pantryMatchLabel}
            </div>
        </div>
    </div>
)
