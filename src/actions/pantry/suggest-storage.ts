'use server'

import type { StorageSuggestion } from '@/types/pantry-item'

import { generateStructured } from '@/lib/ai/gemini'
import { requireUserId } from '@/lib/auth/require-user-id'
import { mockStorageSuggestion } from '@/lib/pantry/mock-storage-suggestion'
import {
    getCachedSuggestion,
    setCachedSuggestion
} from '@/lib/pantry/storage-suggestion-cache'
import { buildSuggestStoragePrompt } from '@/lib/prompts/suggest-storage-prompt'

import { pantryItemNameSchema } from '@/schemas/pantry-item-fields'
import { storageSuggestionShape } from '@/schemas/storage-suggestion-schema'

export const suggestStorage = async (
    name: string,
    options: { fresh?: boolean } = {}
): Promise<StorageSuggestion> => {
    await requireUserId()
    const parsedName = pantryItemNameSchema.parse(name)
    const cached = options.fresh ? null : getCachedSuggestion(parsedName)
    if (cached) return cached

    const today = new Date().toISOString().slice(0, 10)
    const suggestion: StorageSuggestion = await generateStructured(
        buildSuggestStoragePrompt(parsedName, today),
        storageSuggestionShape,
        mockStorageSuggestion,
        0
    )
    setCachedSuggestion(parsedName, suggestion)
    return suggestion
}
