import { useState, useTransition } from 'react'

import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { zodResolver }
    from '@hookform/resolvers/zod'

import type {
    PantryItem,
    StorageSuggestion
} from '@/types/pantry-item'

import { useResetOnChange }
    from '@/hooks/use-reset-on-change'

import { applySuggestedExpiry }
    from '@/lib/pantry/apply-suggested-expiry'

import { pantryTexts }
    from '@/constants/texts/pantry'

import { deletePantryItem }
    from '@/actions/pantry/delete-pantry-item'
import { suggestStorage }
    from '@/actions/pantry/suggest-storage'
import { updatePantryItem }
    from '@/actions/pantry/update-pantry-item'
import {
    addItemFormSchema,
    type AddItemFormValues
} from '@/schemas/add-item-form'

const minNameLengthForSuggestion = 2

const toDateInputValue = (
    date?: Date
): string => {
    if (!date) return ''
    return new Date(date)
        .toISOString()
        .slice(0, 10)
}

const toFormValues = (
    item: PantryItem
): AddItemFormValues => ({
    name: item.name,
    emoji: item.emoji ?? '🥬',
    storage: item.storage,
    type: item.type,
    quantity: item.quantity,
    unit: item.unit,
    expiryDate: toDateInputValue(
        item.expiryDate
    ),
    notes: item.notes ?? ''
})

type UseEditItemFormOptions = {
    item: PantryItem
    onSaved: () => void
    onDeleted: () => void
}

export const useEditItemForm = ({
    item,
    onSaved,
    onDeleted
}: UseEditItemFormOptions) => {
    const form = useForm<AddItemFormValues>({
        resolver: zodResolver(addItemFormSchema),
        defaultValues: toFormValues(item)
    })

    const [suggestion, setSuggestion] = useState<
        StorageSuggestion | null
    >(item.storageSuggestion)
    const [suggestionFailed, setSuggestionFailed] = useState(false)
    const [isSuggesting, startSuggesting] = (
        useTransition()
    )
    const [isSubmitting, startSubmitting] = (
        useTransition()
    )
    const [isDeleting, startDeleting] = useTransition()
    const [confirmDelete, setConfirmDelete] = useState(false)

    const name = useWatch({
        control: form.control,
        name: 'name'
    })

    useResetOnChange(name, () => {
        setSuggestion(null)
        setSuggestionFailed(false)
    })

    const requestSuggestion = () => {
        const trimmedName = name.trim()
        if (trimmedName.length < minNameLengthForSuggestion) return

        startSuggesting(async () => {
            try {
                const result = await suggestStorage(trimmedName)
                setSuggestion(result)
                setSuggestionFailed(false)
                if (result.suggestedType && !form.getValues('type')) {
                    form.setValue('type', result.suggestedType)
                }
            } catch (error) {
                console.error(error)
                setSuggestion(null)
                setSuggestionFailed(true)
            }
        })
    }

    const handleSubmit = form.handleSubmit((values) => {
        startSubmitting(async () => {
            try {
                await updatePantryItem(item._id, {
                    name: values.name.trim(),
                    emoji: values.emoji,
                    storage: values.storage,
                    type: values.type,
                    quantity: values.quantity,
                    unit: values.unit,
                    expiryDate: values.expiryDate
                        ? new Date(values.expiryDate)
                        : undefined,
                    notes: values?.notes.trim(),
                    storageSuggestion: suggestion
                })
                toast.success(pantryTexts.editForm.saveSuccess)
                onSaved()
            } catch (error) {
                console.error(error)
                form.setError('root', {
                    message: pantryTexts.editForm.saveError
                })
                toast.error(pantryTexts.editForm.saveError)
            }
        })
    })

    const handleDelete = () => {
        startDeleting(async () => {
            try {
                await deletePantryItem(item._id)
                setConfirmDelete(false)
                toast.success(pantryTexts.editForm.deleteSuccess)
                onDeleted()
            } catch (error) {
                console.error(error)
                toast.error(pantryTexts.editForm.deleteError)
            }
        })
    }

    return {
        form,
        suggestion,
        isSuggesting,
        suggestionFailed,
        isSubmitting,
        isDeleting,
        confirmDelete,
        setConfirmDelete,
        requestSuggestion,
        handleSubmit,
        handleDelete,
        applySuggestedStorage: () => {
            if (suggestion) {
                form.setValue(
                    'storage',
                    suggestion.suggestedStorage
                )
            }
        },
        applySuggestedExpiry: () => (
            applySuggestedExpiry(form, suggestion)
        )
    }
}
