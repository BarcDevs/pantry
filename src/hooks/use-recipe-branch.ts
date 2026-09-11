'use client'

import { useTransition } from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'sonner'

import type { RecipeDoc } from '@/types/recipe'

import { useRecipeAdjustments } from '@/hooks/use-recipe-adjustments'

import { routes } from '@/constants/routes'
import { recipesTexts } from '@/constants/texts/recipes'

import { branchRecipe } from '@/actions/recipes/branch-recipe'

export const useRecipeBranch = (recipe: RecipeDoc) => {
    const router = useRouter()
    const adjustments = useRecipeAdjustments()
    const [isBranching, startBranching] = useTransition()

    const branch = () => {
        if (!adjustments.instruction.trim()) return

        startBranching(async () => {
            try {
                const branched = await branchRecipe(recipe, adjustments.instruction.trim())
                toast.success(recipesTexts.detail.branchSuccess)
                router.push(routes.recipeDetail(branched._id))
            } catch (error) {
                console.error(error)
                toast.error(recipesTexts.detail.branchError)
            }
        })
    }

    return {
        ...adjustments,
        isBranching,
        branch
    }
}
