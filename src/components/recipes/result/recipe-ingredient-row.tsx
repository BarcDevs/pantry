import { usePathname } from 'next/navigation'

import type { RecipeIngredient } from '@/types/recipe'

import { RecipeAddToPantryButton } from '@/components/recipes/result/recipe-add-to-pantry-button'
import { ReplacementPicker } from '@/components/recipes/result/replacement-picker'
import { ToggleTextButton } from '@/components/shared/buttons/ToggleTextButton'

import { formatQuantity } from '@/lib/recipes/format-quantity'
import { cn } from '@/lib/utils'

import { routes } from '@/constants/routes'
import { recipesTexts } from '@/constants/texts/recipes'

type RecipeIngredientRowProps = {
    ingredient: RecipeIngredient
    isReplacementAdded?: boolean
    onToggleReplacement?: () => void
    onChooseReplacement?: (replacementName: string) => void
    isRemovalAdded?: boolean
    onToggleRemoval?: () => void
}

export const RecipeIngredientRow = ({
    ingredient,
    isReplacementAdded = false,
    onToggleReplacement,
    onChooseReplacement,
    isRemovalAdded = false,
    onToggleRemoval
}: RecipeIngredientRowProps) => {
    const pathname = usePathname()
    const hasReplacement = !ingredient.inPantry && !!ingredient.replacementName
    const isUsingReplacement = hasReplacement && isReplacementAdded
    const canAddToPantry = !ingredient.inPantry && !isUsingReplacement && !isRemovalAdded
    const canPickReplacement = hasReplacement
        && !isRemovalAdded
        && !!onChooseReplacement
        && (ingredient.replacementOptions?.length ?? 0) > 1
    const statusLabel = isUsingReplacement
        ? recipesTexts.result.ingredientUsingReplacementLabel(ingredient.replacementName!)
        : isRemovalAdded
            ? recipesTexts.result.ingredientRemovedLabel
            : ingredient.replacementName
                ? recipesTexts.result.ingredientReplacementLabel(ingredient.replacementName)
                : recipesTexts.result.ingredientMissingLabel
    const statusClassName = cn(
        isUsingReplacement && 'text-green',
        !isUsingReplacement && isRemovalAdded && 'text-ink-3',
        !isUsingReplacement && !isRemovalAdded && hasReplacement && 'text-status-amber-fg',
        !isUsingReplacement && !isRemovalAdded && !hasReplacement && 'text-status-red-fg'
    )

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
                <span className={'flex flex-1 items-baseline gap-1.5 text-body font-bold text-ink'}>
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
                    canPickReplacement
                        ? (
                            <ReplacementPicker
                                value={ingredient.replacementName!}
                                options={ingredient.replacementOptions!}
                                label={statusLabel}
                                onChange={onChooseReplacement!}
                                className={statusClassName}
                            />
                        )
                        : (
                            <span className={cn('text-caption font-bold', statusClassName)}>
                                {statusLabel}
                            </span>
                        )
                )}
                {ingredient.optional && (
                    <span className={'rounded-full bg-border-3 px-2 py-0.5 text-caption text-ink-3'}>
                        {recipesTexts.result.ingredientOptionalLabel}
                    </span>
                )}
            </div>
            {(canAddToPantry || hasReplacement || ingredient.optional) && (
                <div className={'me-4.5 mt-1.5 flex flex-wrap gap-1.5'}>
                    {canAddToPantry && (
                        <RecipeAddToPantryButton
                            href={routes.addItemPrefilled(
                                ingredient.label,
                                Number(ingredient.quantity),
                                ingredient.unit,
                                pathname ?? undefined
                            )}
                        />
                    )}
                    {hasReplacement && onToggleReplacement && (
                        <ToggleTextButton
                            isActive={isReplacementAdded}
                            onClick={onToggleReplacement}
                        >
                            {isReplacementAdded
                                ? recipesTexts.result.removeFromAdjustments
                                : recipesTexts.result.addToAdjustments}
                        </ToggleTextButton>
                    )}
                    {ingredient.optional && onToggleRemoval && (
                        <ToggleTextButton
                            isActive={isRemovalAdded}
                            onClick={onToggleRemoval}
                        >
                            {isRemovalAdded
                                ? recipesTexts.result.removeFromAdjustments
                                : recipesTexts.result.removeIngredientButton}
                        </ToggleTextButton>
                    )}
                </div>
            )}
        </div>
    )
}
