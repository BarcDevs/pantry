import type { RecipeIngredient } from '@/types/recipe'

import { formatQuantity } from '@/lib/recipes/format-quantity'
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
        <span className={'flex items-baseline gap-1.5 text-body text-ink'}>
            <span className={'text-label text-ink-3'}>
                {`${formatQuantity(ingredient.quantity)} ${recipesTexts.unitLabels[ingredient.unit]}`}
            </span>
            <span>
                {ingredient.name}
            </span>
        </span>
        {ingredient.optional && (
            <span className={'ms-auto rounded-full bg-border-3 px-2 py-0.5 text-caption text-ink-3'}>
                {recipesTexts.result.ingredientOptionalLabel}
            </span>
        )}
    </div>
)
