import { useState, useTransition } from 'react'

import { FoodType, StorageLocation } from '@/types/enums'
import type { StorageSuggestion } from '@/types/pantry-item'
import type { ReceiptReviewRow, ReceiptReviewRowEditPatch } from '@/types/receipt-review-row'

import { suggestStorage } from '@/actions/pantry/suggest-storage'

export const useReceiptRowEdit = (row: ReceiptReviewRow) => {
    const [name, setName] = useState(row.name)
    const [storage, setStorage] = useState<StorageLocation>(row.storage)
    const [type, setType] = useState<FoodType | null>(row.type)
    const [expiryDate, setExpiryDate] = useState(row.expiryDate)
    const [suggestion, setSuggestion] = useState<StorageSuggestion | null>(row.storageSuggestion)
    const [suggestionFailed, setSuggestionFailed] = useState(false)
    const [isSuggesting, startSuggesting] = useTransition()

    const requestSuggestion = () => {
        const trimmedName = name.trim()
        if (trimmedName.length < 2) return

        startSuggesting(async () => {
            try {
                const result = await suggestStorage(trimmedName)
                setSuggestion(result)
                setSuggestionFailed(false)
                if (result.suggestedType && !type) {
                    setType(result.suggestedType)
                }
            } catch (error) {
                console.error(error)
                setSuggestion(null)
                setSuggestionFailed(true)
            }
        })
    }

    const applySuggestedStorage = () => {
        if (suggestion) setStorage(suggestion.suggestedStorage)
    }

    const applySuggestedExpiry = () => {
        const entry = suggestion?.expiryByStorage[storage]
        if (entry) setExpiryDate(entry.date)
    }

    const buildPatch = (): ReceiptReviewRowEditPatch => ({
        name,
        storage,
        type,
        expiryDate,
        storageSuggestion: suggestion
    })

    return {
        name,
        setName,
        storage,
        setStorage,
        type,
        setType,
        expiryDate,
        setExpiryDate,
        suggestion,
        isSuggesting,
        suggestionFailed,
        requestSuggestion,
        applySuggestedStorage,
        applySuggestedExpiry,
        buildPatch
    }
}
