import {
    useEffect,
    useState,
    useTransition
} from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'sonner'

import type {
    GeneratedRetryContext,
    RecipeDoc
} from '@/types/recipe'

import {
    readGeneratedRetryContext,
    saveGeneratedRecipe
} from '@/lib/recipes/generated-recipe-storage'

import { routes } from '@/constants/routes'
import { recipesTexts } from '@/constants/texts/recipes'

import { generateRecipe } from '@/actions/recipes/generate-recipe'

/**
 * "Try another recipe" for a freshly generated draft: re-runs the request that
 * produced it, excluding every source page already shown for this draft chain.
 */
export const useRecipeRetry = (
    onRecipeReplaced: (recipe: RecipeDoc) => void
) => {
    const router = useRouter()

    const [context, setContext] = useState<GeneratedRetryContext | null>(null)
    const [isRetrying, startRetrying] = useTransition()
    const [isNoMatchOpen, setIsNoMatchOpen] = useState(false)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage, not derived from React state
        setContext(readGeneratedRetryContext())
    }, [])

    const run = (isAiAllowed?: boolean) => {
        if (!context) return

        const request = {
            ...context.request,
            allowAiGeneration: isAiAllowed ?? context.request.allowAiGeneration
        }
        setIsNoMatchOpen(false)
        startRetrying(async () => {
            try {
                const result = await generateRecipe({
                    ...request,
                    excludeUrls: context.shownUrls
                })
                if (result.status === 'found') {
                    const nextContext = {
                        request,
                        shownUrls: result.recipe.sourceUrl
                            ? [...context.shownUrls, result.recipe.sourceUrl]
                            : context.shownUrls
                    }
                    saveGeneratedRecipe(result.recipe, nextContext)
                    setContext(nextContext)
                    onRecipeReplaced(result.recipe)
                    return
                }
                if (result.reason === 'not-found') setIsNoMatchOpen(true)
                else toast.error(recipesTexts.generate.generateError)
            } catch (error) {
                console.error(error)
                toast.error(recipesTexts.generate.generateError)
            }
        })
    }

    return {
        hasContext: context !== null,
        isRetrying,
        run: () => run(),
        noMatch: {
            isOpen: isNoMatchOpen,
            dish: context?.request.customInstructions ?? '',
            close: () => setIsNoMatchOpen(false),
            enableAiAndRetry: () => run(true),
            editRequest: () => router.push(routes.generate)
        }
    }
}
