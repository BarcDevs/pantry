import type { RecipeIngredient } from '@/types/recipe'

import { cn } from '@/lib/utils'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeIngredientRowProps = {
    ingredient: RecipeIngredient
}

export const RecipeIngredientRow = ({
    ingredient
}: RecipeIngredientRowProps) => (
    <div className={'flex items-center gap-2.5 border-b border-border-3 py-2.75 last:border-b-0'}>
        <span
            className={cn(
                'size-2 shrink-0 rounded-full',
                ingredient.inPantry ? 'bg-green' : 'bg-status-amber-fg'
            )}
        />
        <span className={'flex-1 text-body text-ink'}>
            {ingredient.name}
        </span>
        {ingredient.optional && (
            <span className={'rounded-full bg-border-3 px-2 py-0.5 text-caption text-ink-3'}>
                {recipesTexts.result.ingredientOptionalLabel}
            </span>
        )}
        <span className={'text-label text-ink-3'}>
            {`${ingredient.quantity} ${recipesTexts.unitLabels[ingredient.unit]}`}
        </span>
    </div>
)
