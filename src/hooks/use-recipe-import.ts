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
    clearImportDraft,
    readImportDraft,
    saveImportDraft
} from '@/lib/recipes/import-draft-storage'

import { routes } from '@/constants/routes'
import { recipesTexts } from '@/constants/texts/recipes'

import { importRecipeFromText } from '@/actions/recipes/import-recipe-from-text'
import { importRecipeFromUrl } from '@/actions/recipes/import-recipe-from-url'
import { refineRecipe } from '@/actions/recipes/refine-recipe'
import { saveRecipe } from '@/actions/recipes/save-recipe'

export const useRecipeImport = () => {
    const router = useRouter()
    const [recipe, setRecipe] = useState<RecipeDoc | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isImporting, startImporting] = useTransition()
    const [isSaving, startSaving] = useTransition()
    const [isRefining, startRefining] = useTransition()
    const adjustments = useRecipeAdjustments()
    const { reset: resetAdjustments } = adjustments

    const refreshPantryStatus = useRefreshPantryStatus(setRecipe)

    useEffect(() => {
        const draft = readImportDraft()
        if (!draft) return
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage, not derived from React state
        setRecipe(draft)
        refreshPantryStatus(draft)
    }, [refreshPantryStatus])

    const commitRecipe = (next: RecipeDoc) => {
        setRecipe(next)
        saveImportDraft(next)
    }

    const importFromUrl = (url: string) => {
        setError(null)
        startImporting(async () => {
            try {
                const result = await importRecipeFromUrl(url)
                if (result.fallbackToManual || !result.recipe) {
                    setError(recipesTexts.import.importError)
                    return
                }
                commitRecipe(result.recipe)
            } catch {
                setError(recipesTexts.import.importError)
            }
        })
    }

    const importFromText = (text: string, imageUrl?: string) => {
        setError(null)
        startImporting(async () => {
            try {
                const result = await importRecipeFromText(text, imageUrl)
                if (result.fallbackToManual || !result.recipe) {
                    setError(recipesTexts.import.importError)
                    return
                }
                commitRecipe(result.recipe)
            } catch {
                setError(recipesTexts.import.importError)
            }
        })
    }

    const setTitle = (title: string) => {
        if (recipe) commitRecipe({ ...recipe, title })
    }

    const dismiss = () => {
        clearImportDraft()
        setRecipe(null)
        resetAdjustments()
    }

    const refine = () => {
        const instruction = adjustments.instruction.trim()
        if (!recipe || !instruction) return
        startRefining(async () => {
            try {
                commitRecipe(await refineRecipe({
                    recipe,
                    instruction
                }))
                resetAdjustments()
            } catch {
                toast.error(recipesTexts.result.refineError)
            }
        })
    }

    const save = () => {
        if (!recipe) return
        startSaving(async () => {
            try {
                const saved = await saveRecipe(recipe)
                clearImportDraft()
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
        save,
        adjustments,
        isRefining,
        refine,
        dismiss
    }
}
