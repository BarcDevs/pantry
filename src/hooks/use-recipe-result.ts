import {
    useEffect,
    useState,
    useTransition
} from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'sonner'

import type { RecipeDoc } from '@/types/recipe'

import { useRecipeAdjustments } from '@/hooks/use-recipe-adjustments'
import { useRefreshPantryStatus } from '@/hooks/use-refresh-pantry-status'

import {
    clearGeneratedRecipe,
    readGeneratedRecipe,
    saveGeneratedRecipe
} from '@/lib/recipes/generated-recipe-storage'

import { routes } from '@/constants/routes'
import { recipesTexts } from '@/constants/texts/recipes'

import { refineRecipe } from '@/actions/recipes/refine-recipe'
import { saveRecipe } from '@/actions/recipes/save-recipe'

export const useRecipeResult = () => {
    const router = useRouter()

    const [recipe, setRecipe] = useState<RecipeDoc | null>(null)
    const [savedRecipeId, setSavedRecipeId] = useState<string | null>(null)
    const adjustments = useRecipeAdjustments()
    const [isRefining, startRefining] = useTransition()
    const [isSaving, startSaving] = useTransition()
    const refreshPantryStatus = useRefreshPantryStatus(setRecipe)

    useEffect(() => {
        const stored = readGeneratedRecipe()
        if (!stored) {
            router.replace(routes.generate)
            return
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from sessionStorage, not derived from React state
        setRecipe(stored)
        refreshPantryStatus(stored)
    }, [router, refreshPantryStatus])

    const commitRecipe = (next: RecipeDoc) => {
        setRecipe(next)
        setSavedRecipeId(null)
        saveGeneratedRecipe(next)
    }

    const updateRecipe = (changes: Partial<RecipeDoc>) => {
        if (recipe) commitRecipe({ ...recipe, ...changes })
    }

    const dismiss = () => {
        clearGeneratedRecipe()
        router.push(routes.generate)
    }

    const refine = () => {
        if (!recipe || !adjustments.instruction.trim()) return

        startRefining(async () => {
            try {
                const refined = await refineRecipe({
                    recipe,
                    instruction: adjustments.instruction.trim()
                })
                commitRecipe(refined)
                adjustments.reset()
            } catch (error) {
                console.error(error)
                toast.error(recipesTexts.result.refineError)
            }
        })
    }

    const toggleFavorite = () => {
        if (!recipe) return
        updateRecipe({ isFavorite: !recipe.isFavorite })
    }

    const setManualImageUrl = (imageUrl: string) => {
        updateRecipe({ imageUrl: imageUrl || undefined })
    }

    const save = (): Promise<string | null> => (
        new Promise((resolve) => {
            if (!recipe) {
                resolve(null)
                return
            }
            startSaving(async () => {
                try {
                    const saved = await saveRecipe(recipe)
                    setSavedRecipeId(saved._id)
                    clearGeneratedRecipe()
                    resolve(saved._id)
                } catch (error) {
                    console.error(error)
                    toast.error(recipesTexts.result.saveError)
                    resolve(null)
                }
            })
        })
    )

    const startCooking = async () => {
        const id = savedRecipeId ?? await save()
        if (id) router.push(routes.recipeCook(id))
    }

    return {
        recipe,
        savedRecipeId,
        refineInstruction: adjustments.instruction,
        setRefineInstruction: adjustments.setInstruction,
        usedReplacements: adjustments.usedReplacements,
        toggleReplacement: adjustments.toggleReplacement,
        usedRemovals: adjustments.usedRemovals,
        toggleRemoval: adjustments.toggleRemoval,
        isRefining,
        refine,
        dismiss,
        toggleFavorite,
        setManualImageUrl,
        isSaving,
        save,
        startCooking
    }
}
