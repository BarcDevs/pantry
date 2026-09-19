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
    const deductRecipe = useDeductRecipe(
        recipe._id,
        recipe.ingredients,
        pantryItems
    )

    return (
        <div className={'mx-auto max-w-screen-sm px-4 py-8'}>
            <DeductHeader/>
            <DeductRowsList
                rows={deductRecipe.rows}
                onMinus={(id) => deductRecipe.adjustUsed(id, -1)}
                onPlus={(id) => deductRecipe.adjustUsed(id, 1)}
                onKeep={(id) => deductRecipe.setChoice(id, 'keep')}
                onDelete={(id) => deductRecipe.setChoice(id, 'delete')}
            />
            <DeductActions
                isSubmitting={deductRecipe.isSubmitting}
                onConfirm={deductRecipe.confirmDeduct}
                onSkip={deductRecipe.skipDeduct}
            />
        </div>
    )
}
