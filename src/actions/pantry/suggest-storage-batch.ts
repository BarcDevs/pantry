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
import { buildSuggestStorageBatchPrompt } from '@/lib/prompts/suggest-storage-prompt'

import { pantryItemNameSchema } from '@/schemas/pantry-item-fields'
import { storageSuggestionBatchSchema } from '@/schemas/storage-suggestion-schema'

const namesSchema = z.array(pantryItemNameSchema).max(200)

export const suggestStorageBatch = async (
    names: string[]
): Promise<Array<StorageSuggestion | null>> => {
    await requireUserId()
    const parsedNames = namesSchema.parse(names)
    const missing = [...new Set(parsedNames)]
        .filter((name) => getCachedSuggestion(name) === null)

    if (missing.length > 0) {
        const today = new Date().toISOString().slice(0, 10)
        const { suggestions } = await generateStructured(
            buildSuggestStorageBatchPrompt(missing, today),
            storageSuggestionBatchSchema,
            () => ({
                suggestions: missing.map((name) => ({
                    ...mockStorageSuggestion(),
                    name
                }))
            }),
            0
        )
        suggestions.forEach(({ name, ...suggestion }) => {
            if (missing.includes(name)) setCachedSuggestion(name, suggestion)
        })
    }

    return parsedNames.map((name) => getCachedSuggestion(name))
}
