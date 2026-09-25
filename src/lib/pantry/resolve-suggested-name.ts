import type { StorageSuggestion } from '@/types/pantry-item'

/** Only auto-corrects when the AI's suggestion differs from what the user currently typed. */
export const resolveSuggestedName = (
    suggestion: StorageSuggestion,
    currentName: string
): string | null => {
    const suggestedName = suggestion.suggestedName?.trim()
    if (!suggestedName || suggestedName === currentName.trim()) return null
    return suggestedName
}
