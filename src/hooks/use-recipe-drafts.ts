import {
    useEffect,
    useState
} from 'react'

import type { RecipeDoc } from '@/types/recipe'

import {
    clearGeneratedRecipe,
    readGeneratedRecipe
} from '@/lib/recipes/generated-recipe-storage'
import {
    clearImportDraft,
    readImportDraft
} from '@/lib/recipes/import-draft-storage'

import { routes } from '@/constants/routes'

export type RecipeDraft = {
    kind: 'generated' | 'imported'
    recipe: RecipeDoc
    href: string
}

export const useRecipeDrafts = () => {
    const [drafts, setDrafts] = useState<RecipeDraft[]>([])

    useEffect(() => {
        const generated = readGeneratedRecipe()
        const imported = readImportDraft()
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage, not derived from React state
        setDrafts([
            ...(generated
                ? [{
                    kind: 'generated' as const,
                    recipe: generated,
                    href: routes.generateResult
                }] : []),
            ...(imported ? [{
                kind: 'imported' as const,
                recipe: imported,
                href: routes.recipeImport
            }] : [])
        ])
    }, [])

    const dismiss = (kind: RecipeDraft['kind']) => {
        if (kind === 'generated') clearGeneratedRecipe()
        else clearImportDraft()
        setDrafts((current) =>
            current.filter((draft) => draft.kind !== kind))
    }

    return {
        drafts,
        dismiss
    }
}
