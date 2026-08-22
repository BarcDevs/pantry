import type { UseFormReturn } from 'react-hook-form'

import type { StorageSuggestion } from '@/types/pantry-item'

import type { AddItemFormValues } from '@/schemas/add-item-form'

export const applySuggestedExpiry = (
    form: UseFormReturn<AddItemFormValues>,
    suggestion: StorageSuggestion | null
) => {
    const storage = form.getValues('storage')
    const entry = suggestion?.expiryByStorage[storage]
    if (entry) {
        form.setValue('expiryDate', entry.date)
    }
}
