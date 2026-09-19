import type { RecipeDoc } from '@/types/recipe'

import { minuteInMs } from '@/constants/time'

export const draftTtlMs = 30 * minuteInMs

type StoredDraft = {
    savedAt: number
    recipe: RecipeDoc
}

export const createRecipeDraftStorage = (key: string) => ({
    save: (recipe: RecipeDoc): void => {
        try {
            const draft: StoredDraft = {
                savedAt: Date.now(),
                recipe
            }
            localStorage.setItem(key, JSON.stringify(draft))
        } catch {
            // storage unavailable: the draft just won't survive navigation
        }
    },
    read: (): RecipeDoc | null => {
        try {
            const raw = localStorage.getItem(key)
            if (!raw) return null
            const draft = JSON.parse(raw) as StoredDraft
            if (Date.now() - draft.savedAt >= draftTtlMs) {
                localStorage.removeItem(key)
                return null
            }
            return draft.recipe
        } catch {
            return null
        }
    },
    clear: (): void => {
        try {
            localStorage.removeItem(key)
        } catch {
            // storage unavailable: nothing to clear
        }
    }
})
