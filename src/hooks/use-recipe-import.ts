import { useState, useTransition } from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'sonner'

import type { RecipeDoc } from '@/types/recipe'

import { routes } from '@/constants/routes'
import { recipesTexts } from '@/constants/texts/recipes'

import { importRecipeFromText } from '@/actions/recipes/import-recipe-from-text'
import { importRecipeFromUrl } from '@/actions/recipes/import-recipe-from-url'
import { saveRecipe } from '@/actions/recipes/save-recipe'

export const useRecipeImport = () => {
    const router = useRouter()
    const [recipe, setRecipe] = useState<RecipeDoc | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isImporting, startImporting] = useTransition()
    const [isSaving, startSaving] = useTransition()

    const importFromUrl = (url: string) => {
        setError(null)
        startImporting(async () => {
            try {
                const result = await importRecipeFromUrl(url)
                if (result.fallbackToManual || !result.recipe) {
                    setError(recipesTexts.import.importError)
                    return
                }
                setRecipe(result.recipe)
            } catch {
                setError(recipesTexts.import.importError)
            }
        })
    }

    const importFromText = (text: string) => {
        setError(null)
        startImporting(async () => {
            try {
                const result = await importRecipeFromText(text)
                if (result.fallbackToManual || !result.recipe) {
                    setError(recipesTexts.import.importError)
                    return
                }
                setRecipe(result.recipe)
            } catch {
                setError(recipesTexts.import.importError)
            }
        })
    }

    const setTitle = (title: string) => setRecipe(
        (prev) => (prev ? { ...prev, title } : prev)
    )

    const save = () => {
        if (!recipe) return
        startSaving(async () => {
            try {
                const saved = await saveRecipe(recipe)
                toast.success(recipesTexts.import.saveSuccess)
                router.push(routes.recipeDetail(saved._id))
            } catch {
                toast.error(recipesTexts.import.saveError)
            }
        })
    }

    return {
        recipe,
        error,
        isImporting,
        isSaving,
        importFromUrl,
        importFromText,
        setTitle,
        save
    }
}
