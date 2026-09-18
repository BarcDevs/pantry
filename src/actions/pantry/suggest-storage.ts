'use server'

import { z } from 'zod'

import type { StorageSuggestion } from '@/types/pantry-item'

import { generateStructured } from '@/lib/ai/gemini'
import { requireUserId } from '@/lib/auth/require-user-id'
import { mockStorageSuggestion } from '@/lib/pantry/mock-storage-suggestion'
import {
    getCachedSuggestion,
    setCachedSuggestion
} from '@/lib/pantry/storage-suggestion-cache'
import { storageSuggestionShape } from '@/lib/pantry/storage-suggestion-schema'
import { buildSuggestStoragePrompt } from '@/lib/prompts/suggest-storage-prompt'

export const suggestStorage = async (
    name: string
): Promise<StorageSuggestion> => {
    await requireUserId()
    const parsedName = z.string().trim().min(1).max(100).parse(name)
    const cached = getCachedSuggestion(parsedName)
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
