import {
    useState,
    useTransition
} from 'react'

import {
    useForm,
    useWatch
} from 'react-hook-form'
import { toast } from 'sonner'

import { zodResolver } from '@hookform/resolvers/zod'

import type {
    PantryItem,
    StorageSuggestion
} from '@/types/pantry-item'

import { useNameCorrection } from '@/hooks/use-name-correction'
import { useStorageSuggestion } from '@/hooks/use-storage-suggestion'

import { applySuggestedExpiry } from '@/lib/pantry/apply-suggested-expiry'
import { resolveSuggestedName } from '@/lib/pantry/resolve-suggested-name'
import { resolveSuggestedType } from '@/lib/pantry/resolve-suggested-type'

import { pantryTexts } from '@/constants/texts/pantry'

import { deletePantryItem } from '@/actions/pantry/delete-pantry-item'
import { updatePantryItem } from '@/actions/pantry/update-pantry-item'
import {
    addItemFormSchema,
    type AddItemFormValues
} from '@/schemas/add-item-form'

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

    const storageSuggestion = useStorageSuggestion(
        item.storageSuggestion,
        item.name
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
    const nameCorrection = useNameCorrection(
        form,
        name,
        'name'
    )

    const applySuggestedType = (
        result: StorageSuggestion,
        isFresh = false
    ) => {
        const suggestedType = resolveSuggestedType(
            result,
            form.getValues('type'),
            isFresh
        )
        if (suggestedType) form.setValue('type', suggestedType)

        const suggestedName = resolveSuggestedName(
            result,
            form.getValues('name')
        )
        if (suggestedName) nameCorrection.apply(name, suggestedName)
    }

    const requestSuggestion = () => storageSuggestion.request(name, {
        onSuggested: applySuggestedType
    })
    const refreshSuggestion = () => storageSuggestion.request(name, {
        fresh: true,
        onSuggested: (result) => applySuggestedType(result, true)
    })

    const handleSubmit = form.handleSubmit((values) => {
        startSubmitting(async () => {
            try {
                await updatePantryItem(item._id, {
                    name: values.name.trim(),
                    storage: values.storage,
                    type: values.type,
                    quantity: values.quantity,
                    unit: values.unit,
                    expiryDate: values.expiryDate
                        ? new Date(values.expiryDate)
                        : undefined,
                    notes: values?.notes.trim(),
                    storageSuggestion: storageSuggestion.suggestion
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
        nameCorrection: {
            correctedFrom: nameCorrection.correctedFrom,
            revert: nameCorrection.revert
        },
        suggestion: {
            value: storageSuggestion.suggestion,
            isSuggesting: storageSuggestion.isSuggesting,
            failed: storageSuggestion.suggestionFailed,
            stale: storageSuggestion.isStaleFor(name),
            request: requestSuggestion,
            refresh: refreshSuggestion,
            applyStorage: () => {
                if (storageSuggestion.suggestion) {
                    form.setValue(
                        'storage',
                        storageSuggestion.suggestion.suggestedStorage
                    )
                }
            },
            applyExpiry: () => (
                applySuggestedExpiry(form, storageSuggestion.suggestion)
            )
        },
        submission: {
            isSubmitting,
            submit: handleSubmit
        },
        deletion: {
            isConfirming: confirmDelete,
            setIsConfirming: setConfirmDelete,
            isDeleting,
            confirm: handleDelete
        }
    }
}
