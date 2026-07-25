import {
    useEffect,
    useState,
    useTransition
} from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'sonner'

import type { RecipeDoc } from '@/types/recipe'

import {
    clearGeneratedRecipe,
    readGeneratedRecipe
} from '@/lib/recipes/generated-recipe-storage'

import { routes } from '@/constants/routes'
import { recipesTexts } from '@/constants/texts/recipes'

import { refineRecipe } from '@/actions/recipes/refine-recipe'
import { saveRecipe } from '@/actions/recipes/save-recipe'

export const useRecipeResult = () => {
    const router = useRouter()

    const [recipe, setRecipe] = useState<RecipeDoc | null>(null)
    const [savedRecipeId, setSavedRecipeId] = useState<string | null>(null)
    const [refineInstruction, setRefineInstruction] = useState('')
    const [isRefining, startRefining] = useTransition()
    const [isSaving, startSaving] = useTransition()

    useEffect(() => {
        const stored = readGeneratedRecipe()
        if (!stored) {
            router.replace(routes.generate)
            return
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from sessionStorage, not derived from React state
        setRecipe(stored)
    }, [router])

    const updateRecipe = (changes: Partial<RecipeDoc>) => {
        setRecipe((current) => (
            current ? { ...current, ...changes } : current
        ))
        setSavedRecipeId(null)
    }

    const refine = () => {
        if (!recipe || !refineInstruction.trim()) return

        startRefining(async () => {
            try {
                const refined = await refineRecipe({
                    recipe,
                    instruction: refineInstruction.trim()
                })
                setRecipe(refined)
                setSavedRecipeId(null)
                setRefineInstruction('')
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
        refineInstruction,
        setRefineInstruction,
        isRefining,
        refine,
        toggleFavorite,
        setManualImageUrl,
        isSaving,
        save,
        startCooking
    }
}
