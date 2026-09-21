import type { RecipeDoc } from '@/types/recipe'

import { minuteInMs } from '@/constants/time'

export const draftTtlMs = 30 * minuteInMs

type StoredDraft<TContext> = {
    savedAt: number
    recipe: RecipeDoc
    context?: TContext
}

/**
 * `context` is extra data that lives and dies with the draft (same ttl, same
 * clear). Saving without a context keeps the one already stored, so editing a
 * draft never loses it.
 */
export const createRecipeDraftStorage = <TContext = never>(key: string) => {
    const readStored = (): StoredDraft<TContext> | null => {
        try {
            const raw = localStorage.getItem(key)
            if (!raw) return null
            const draft = JSON.parse(raw) as StoredDraft<TContext>
            if (Date.now() - draft.savedAt >= draftTtlMs) {
                localStorage.removeItem(key)
                return null
            }
            return draft
        } catch {
            return null
        }
    }

    return {
        save: (recipe: RecipeDoc, context?: TContext): void => {
            try {
                const draft: StoredDraft<TContext> = {
                    savedAt: Date.now(),
                    recipe,
                    context: context ?? readStored()?.context
                }
                localStorage.setItem(key, JSON.stringify(draft))
            } catch {
                // storage unavailable: the draft just won't survive navigation
            }
        },
        read: (): RecipeDoc | null => readStored()?.recipe ?? null,
        readContext: (): TContext | null => readStored()?.context ?? null,
        clear: (): void => {
            try {
                localStorage.removeItem(key)
            } catch {
                // storage unavailable: nothing to clear
            }
        }
    }
}
