import { useState } from 'react'

import {
    FoodType,
    StorageLocation
} from '@/types/enums'
import type { StorageSuggestion } from '@/types/pantry-item'
import type {
    ReceiptReviewRow,
    ReceiptReviewRowEditPatch
} from '@/types/receipt-review-row'

import { useStorageSuggestion } from '@/hooks/use-storage-suggestion'

import { resolveSuggestedType } from '@/lib/pantry/resolve-suggested-type'

type RowEditValues = {
    name: string
    storage: StorageLocation
    type: FoodType | null
    expiryDate: string
}

export const useReceiptRowEdit = (row: ReceiptReviewRow) => {
    const [values, setValues] = useState<RowEditValues>({
        name: row.name,
        storage: row.storage,
        type: row.type,
        expiryDate: row.expiryDate
    })
    const storageSuggestion = useStorageSuggestion(row.storageSuggestion)
    const { suggestion } = storageSuggestion

    const setField = <Key extends keyof RowEditValues>(
        key: Key,
        value: RowEditValues[Key]
    ) => setValues((current) => ({
        ...current,
        [key]: value
    }))

    const applySuggestedType = (
        result: StorageSuggestion,
        isFresh = false
    ) => setValues((current) => ({
        ...current,
        type: resolveSuggestedType(
            result,
            current.type,
            isFresh
        ) ?? current.type
    }))

    const requestSuggestion = () => storageSuggestion.request(values.name, {
        onSuggested: applySuggestedType
    })
    const refreshSuggestion = () => storageSuggestion.request(values.name, {
        fresh: true,
        onSuggested: (result) => applySuggestedType(result, true)
    })

    const applySuggestedStorage = () => {
        if (suggestion) setField('storage', suggestion.suggestedStorage)
    }

    const applySuggestedExpiry = () => {
        const entry = suggestion?.expiryByStorage[values.storage]
        if (entry) setField('expiryDate', entry.date)
    }

    const buildPatch = (): ReceiptReviewRowEditPatch => ({
        ...values,
        storageSuggestion: suggestion
    })

    return {
        values,
        setField,
        suggestion: {
            value: suggestion,
            isSuggesting: storageSuggestion.isSuggesting,
            failed: storageSuggestion.suggestionFailed,
            request: requestSuggestion,
            refresh: refreshSuggestion,
            applyStorage: applySuggestedStorage,
            applyExpiry: applySuggestedExpiry
        },
        buildPatch
    }
}
