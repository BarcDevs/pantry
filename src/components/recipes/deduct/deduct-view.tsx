'use client'

import type { PantryItem } from '@/types/pantry-item'
import type { Recipe } from '@/types/recipe'

import { DeductActions } from '@/components/recipes/deduct/deduct-actions'
import { DeductHeader } from '@/components/recipes/deduct/deduct-header'
import { DeductRowsList } from '@/components/recipes/deduct/deduct-rows-list'

import { useDeductRecipe } from '@/hooks/use-deduct-recipe'

type DeductViewProps = {
    recipe: Recipe
    pantryItems: PantryItem[]
}

export const DeductView = ({
    recipe,
    pantryItems
}: DeductViewProps) => {
    const {
        rows,
        adjustUsed,
        setChoice,
        isSubmitting,
        confirmDeduct,
        skipDeduct
    } = useDeductRecipe(
        recipe._id,
        recipe.ingredients,
        pantryItems
    )

    return (
        <div className={'mx-auto max-w-screen-sm px-4 py-8'}>
            <DeductHeader/>
            <DeductRowsList
                rows={rows}
                onMinus={(id) => adjustUsed(id, -1)}
                onPlus={(id) => adjustUsed(id, 1)}
                onKeep={(id) => setChoice(id, 'keep')}
                onDelete={(id) => setChoice(id, 'delete')}
            />
            <DeductActions
                isSubmitting={isSubmitting}
                onConfirm={confirmDeduct}
                onSkip={skipDeduct}
            />
        </div>
    )
}
