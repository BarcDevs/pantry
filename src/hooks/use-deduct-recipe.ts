import {
    useState,
    useTransition
} from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'sonner'

import type {
    DeductPantryItemEdit,
    DeductRow,
    PantryItem
} from '@/types/pantry-item'
import type { RecipeIngredient } from '@/types/recipe'

import { resolveQuantityNumber } from '@/lib/recipes/resolve-quantity-number'

import { routes } from '@/constants/routes'
import { recipesTexts } from '@/constants/texts/recipes'

import { deductPantryItems } from '@/actions/pantry/deduct-pantry-items'

const buildInitialRows = (
    ingredients: RecipeIngredient[],
    pantryItems: PantryItem[]
): DeductRow[] => (
    ingredients
        .filter((ingredient) => ingredient.inPantry)
        .flatMap((ingredient) => {
            const item = pantryItems.find((pantryItem) => pantryItem.name === ingredient.name)
            if (!item) return []
            return [{
                pantryItemId: item._id,
                name: item.name,
                type: item.type,
                unit: item.unit,
                pantryQty: item.quantity,
                used: Math.min(resolveQuantityNumber(ingredient.quantity), item.quantity),
                choice: null
            }]
        })
)

export const useDeductRecipe = (
    recipeId: string,
    ingredients: RecipeIngredient[],
    pantryItems: PantryItem[]
) => {
    const router = useRouter()
    const [rows, setRows] = useState<DeductRow[]>(
        () => buildInitialRows(ingredients, pantryItems)
    )
    const [isSubmitting, startSubmitting] = useTransition()

    const adjustUsed = (pantryItemId: string, delta: number) => {
        setRows((current) => current.map((row) => (
            row.pantryItemId === pantryItemId
                ? { ...row, used: Math.min(row.pantryQty, Math.max(0, row.used + delta)) }
                : row
        )))
    }

    const setChoice = (pantryItemId: string, choice: 'keep' | 'delete') => {
        setRows((current) => current.map((row) => (
            row.pantryItemId === pantryItemId ? { ...row, choice } : row
        )))
    }

    const goToRating = () => router.push(routes.recipeRate(recipeId))

    const confirmDeduct = () => {
        const hasUnresolvedZero = rows.some((row) => (
            row.pantryQty - row.used <= 0 && row.choice === null
        ))
        if (hasUnresolvedZero) {
            toast.error(recipesTexts.deduct.chooseRequired)
            return
        }

        const edits: DeductPantryItemEdit[] = rows.map((row) => {
            const remaining = row.pantryQty - row.used
            const remove = remaining <= 0 && row.choice === 'delete'
            return {
                id: row.pantryItemId,
                newQuantity: Math.max(0, remaining),
                remove
            }
        })

        startSubmitting(async () => {
            try {
                await deductPantryItems(edits)
                goToRating()
            } catch (error) {
                console.error(error)
                toast.error(recipesTexts.deduct.deductError)
            }
        })
    }

    const skipDeduct = () => goToRating()

    return {
        rows,
        adjustUsed,
        setChoice,
        isSubmitting,
        confirmDeduct,
        skipDeduct
    }
}
