import type { RecipeIngredient } from '@/types/recipe'

import { Button } from '@/components/shared/Button'

import { formatQuantity } from '@/lib/recipes/format-quantity'
import { cn } from '@/lib/utils'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeIngredientRowProps = {
    ingredient: RecipeIngredient
    isReplacementAdded?: boolean
    onToggleReplacement?: () => void
}

export const RecipeIngredientRow = ({
    ingredient,
    isReplacementAdded = false,
    onToggleReplacement
}: RecipeIngredientRowProps) => {
    const hasReplacement = !ingredient.inPantry && !!ingredient.replacementName

    return (
        <div className={'border-b border-border-3 py-2.75 last:border-b-0'}>
            <div className={'flex items-center gap-2.5'}>
                <span
                    className={cn(
                        'size-2 shrink-0 rounded-full',
                        ingredient.inPantry && 'bg-green',
                        !ingredient.inPantry && hasReplacement && 'bg-status-amber-fg',
                        !ingredient.inPantry && !hasReplacement && 'bg-status-red-fg'
                    )}
                />
                <span className={'flex items-baseline gap-1.5 text-body text-ink'}>
                    <span
                        className={cn(
                            'text-label',
                            ingredient.inPantry && 'text-ink-3',
                            !ingredient.inPantry && hasReplacement && 'font-bold text-status-amber-fg',
                            !ingredient.inPantry && !hasReplacement && 'font-bold text-status-red-fg'
                        )}
                    >
                        {!ingredient.inPantry && (
                            ingredient.replacementName
                                ? `${recipesTexts.result.ingredientReplacementLabel(ingredient.replacementName)} · `
                                : `${recipesTexts.result.ingredientMissingLabel} · `
                        )}
                        <span
                            dir={'ltr'}
                            style={{ unicodeBidi: 'isolate' }}
                        >
                            {formatQuantity(ingredient.quantity)}
                        </span>
                        {` ${recipesTexts.unitLabels[ingredient.unit]}`}
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
            {hasReplacement && onToggleReplacement && (
                <Button
                    type={'button'}
                    variant={'ghost'}
                    size={'xs'}
                    onClick={onToggleReplacement}
                    className={cn(
                        'me-4.5 mt-1.5 h-auto shadow-none',
                        isReplacementAdded
                            ? 'text-ink-3 underline'
                            : 'border border-dashed border-warning-border text-status-amber-fg'
                    )}
                >
                    {isReplacementAdded
                        ? recipesTexts.result.removeFromAdjustments
                        : recipesTexts.result.addToAdjustments}
                </Button>
            )}
        </div>
    )
}
