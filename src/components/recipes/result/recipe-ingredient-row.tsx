import type { RecipeIngredient } from '@/types/recipe'

import { Button } from '@/components/shared/Button'

import { formatQuantity } from '@/lib/recipes/format-quantity'
import { cn } from '@/lib/utils'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeIngredientRowProps = {
    ingredient: RecipeIngredient
    isReplacementAdded?: boolean
    onToggleReplacement?: () => void
    isRemovalAdded?: boolean
    onToggleRemoval?: () => void
}

export const RecipeIngredientRow = ({
    ingredient,
    isReplacementAdded = false,
    onToggleReplacement,
    isRemovalAdded = false,
    onToggleRemoval
}: RecipeIngredientRowProps) => {
    const hasReplacement = !ingredient.inPantry && !!ingredient.replacementName
    const isUsingReplacement = hasReplacement && isReplacementAdded

    return (
        <div className={'border-b border-border-3 py-2.75 last:border-b-0'}>
            <div className={'flex items-center gap-2.5'}>
                <span
                    className={cn(
                        'size-2 shrink-0 rounded-full',
                        (ingredient.inPantry || isUsingReplacement) && 'bg-green',
                        !ingredient.inPantry && !isUsingReplacement && isRemovalAdded && 'bg-ink-3',
                        !ingredient.inPantry && !isUsingReplacement && !isRemovalAdded && hasReplacement && 'bg-status-amber-fg',
                        !ingredient.inPantry && !isUsingReplacement && !isRemovalAdded && !hasReplacement && 'bg-status-red-fg'
                    )}
                />
                <span className={'flex flex-1 flex-col'}>
                    <span className={'flex items-baseline gap-1.5 text-body font-bold text-ink'}>
                        <span>
                            {ingredient.label}
                        </span>
                        <span
                            dir={'ltr'}
                            style={{ unicodeBidi: 'isolate' }}
                            className={'font-normal text-ink-3'}
                        >
                            {formatQuantity(ingredient.quantity)}
                        </span>
                        <span className={'font-normal text-ink-3'}>
                            {recipesTexts.unitLabels[ingredient.unit]}
                        </span>
                    </span>
                    {(!ingredient.inPantry || isRemovalAdded) && (
                        <span
                            className={cn(
                                'text-caption',
                                isUsingReplacement && 'text-green',
                                !isUsingReplacement && isRemovalAdded && 'text-ink-3',
                                !isUsingReplacement && !isRemovalAdded && hasReplacement && 'text-status-amber-fg',
                                !isUsingReplacement && !isRemovalAdded && !hasReplacement && 'text-status-red-fg'
                            )}
                        >
                            {isUsingReplacement
                                ? recipesTexts.result.ingredientUsingReplacementLabel(ingredient.replacementName!)
                                : isRemovalAdded
                                    ? recipesTexts.result.ingredientRemovedLabel
                                    : ingredient.replacementName
                                        ? recipesTexts.result.ingredientReplacementLabel(ingredient.replacementName)
                                        : recipesTexts.result.ingredientMissingLabel}
                        </span>
                    )}
                </span>
                {ingredient.optional && (
                    <span className={'ms-auto rounded-full bg-border-3 px-2 py-0.5 text-caption text-ink-3'}>
                        {recipesTexts.result.ingredientOptionalLabel}
                    </span>
                )}
            </div>
            {(hasReplacement || ingredient.optional) && (
                <div className={'me-4.5 mt-1.5 flex flex-wrap gap-1.5'}>
                    {hasReplacement && onToggleReplacement && (
                        <Button
                            type={'button'}
                            variant={'ghost'}
                            size={'xs'}
                            onClick={onToggleReplacement}
                            className={cn(
                                'h-auto shadow-none',
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
                    {ingredient.optional && onToggleRemoval && (
                        <Button
                            type={'button'}
                            variant={'ghost'}
                            size={'xs'}
                            onClick={onToggleRemoval}
                            className={cn(
                                'h-auto shadow-none',
                                isRemovalAdded
                                    ? 'text-ink-3 underline'
                                    : 'border border-dashed border-warning-border text-status-amber-fg'
                            )}
                        >
                            {isRemovalAdded
                                ? recipesTexts.result.removeFromAdjustments
                                : recipesTexts.result.removeIngredientButton}
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}
