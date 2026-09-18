import type { StorageSuggestion } from '@/types/pantry-item'

const cacheTtlMs = 1000 * 60 * 60 * 24
const suggestionCache = new Map<
    string,
    { suggestion: StorageSuggestion, expiresAt: number }
>()

const toKey = (name: string): string => name.toLowerCase()

export const getCachedSuggestion = (name: string): StorageSuggestion | null => {
    const cached = suggestionCache.get(toKey(name))
    return cached && cached.expiresAt > Date.now() ? cached.suggestion : null
}

export const setCachedSuggestion = (
    name: string,
    suggestion: StorageSuggestion
): void => {
    suggestionCache.set(toKey(name), {
        suggestion,
        expiresAt: Date.now() + cacheTtlMs
    })
}
