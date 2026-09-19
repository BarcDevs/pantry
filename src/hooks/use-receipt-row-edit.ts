import { useState } from 'react'

import { FoodType, StorageLocation } from '@/types/enums'
import type { StorageSuggestion } from '@/types/pantry-item'
import type {
    ReceiptReviewRow,
    ReceiptReviewRowEditPatch
} from '@/types/receipt-review-row'

import { useStorageSuggestion } from '@/hooks/use-storage-suggestion'

export const useReceiptRowEdit = (row: ReceiptReviewRow) => {
    const [name, setName] = useState(row.name)
    const [storage, setStorage] = useState<StorageLocation>(row.storage)
    const [type, setType] = useState<FoodType | null>(row.type)
    const [expiryDate, setExpiryDate] = useState(row.expiryDate)
    const {
        suggestion,
        suggestionFailed,
        isSuggesting,
        request
    } = useStorageSuggestion(row.storageSuggestion)

    const applySuggestedType = (
        result: StorageSuggestion,
        shouldOverwrite = false
    ) => {
        if (
            result.suggestedType
            && (shouldOverwrite || !type)
        ) setType(result.suggestedType)
    }

    const requestSuggestion = () => request(name, {
        onSuggested: applySuggestedType
    })
    const refreshSuggestion = () => request(name, {
        fresh: true,
        onSuggested: (result) => applySuggestedType(result, true)
    })

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
        refreshSuggestion,
        applySuggestedStorage,
        applySuggestedExpiry,
        buildPatch
    }
}
