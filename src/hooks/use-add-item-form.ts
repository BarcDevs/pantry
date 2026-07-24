import {
    useEffect,
    useState,
    useTransition
} from 'react'

import { useRouter } from 'next/navigation'

import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { zodResolver }
    from '@hookform/resolvers/zod'

import {
    FoodType,
    StorageLocation,
    Unit
} from '@/types/enums'
import type {
    AddPantryItemInput,
    AddPantryItemOutcome,
    StorageSuggestion
} from '@/types/pantry-item'

import { useDebouncedValue }
    from '@/hooks/use-debounced-value'

import { routes }
    from '@/constants/routes'
import { pantryTexts }
    from '@/constants/texts/pantry'

import { addPantryItems }
    from '@/actions/pantry/add-pantry-items'
import { suggestStorage }
    from '@/actions/pantry/suggest-storage'
import {
    addItemFormSchema,
    type AddItemFormValues
} from '@/schemas/add-item-form'

type DuplicateOutcome = Extract<
    AddPantryItemOutcome,
    { status: 'duplicate' }
>

const nameDebounceMs = 500
const minNameLengthForSuggestion = 2

export const useAddItemForm = () => {
    const router = useRouter()

    const form = useForm<AddItemFormValues>({
        resolver: zodResolver(addItemFormSchema),
        defaultValues: {
            name: '',
            storage: StorageLocation.Fridge,
            type: FoodType.Other,
            quantity: 1,
            unit: Unit.Units,
            expiryDate: '',
            notes: ''
        }
    })

    const [suggestion, setSuggestion] = useState<
        StorageSuggestion | null
    >(null)
    const [isSuggesting, startSuggesting] = (
        useTransition()
    )
    const [isSubmitting, startSubmitting] = (
        useTransition()
    )
    const [duplicate, setDuplicate] = useState<
        DuplicateOutcome | null
    >(null)

    const name = useWatch({
        control: form.control,
        name: 'name'
    })
    const debouncedName = useDebouncedValue(
        name.trim(),
        nameDebounceMs
    )

    useEffect(() => {
        if (debouncedName.length < (
            minNameLengthForSuggestion
        )) {
            return
        }

        let cancelled = false
        startSuggesting(async () => {
            try {
                const result = await suggestStorage(
                    debouncedName
                )
                if (!cancelled) {
                    setSuggestion(result)
                }
            } catch (error) {
                console.error(error)
                if (!cancelled) {
                    setSuggestion(null)
                }
            }
        })

        return () => { cancelled = true }
    }, [debouncedName])

    const effectiveSuggestion = (
        name.trim().length < minNameLengthForSuggestion
    ) ? null : suggestion

    const buildInput = (
        values: AddItemFormValues,
        overrides?: Partial<AddPantryItemInput>
    ): AddPantryItemInput => ({
        name: values.name.trim(),
        storage: values.storage,
        type: values.type,
        quantity: values.quantity,
        unit: values.unit,
        expiryDate: values.expiryDate
            ? new Date(values.expiryDate)
            : undefined,
        notes: values.notes.trim() || undefined,
        storageSuggestion: effectiveSuggestion,
        ...overrides
    })

    const submit = (
        values: AddItemFormValues,
        overrides?: Partial<AddPantryItemInput>
    ) => {
        startSubmitting(async () => {
            try {
                const [outcome] = await addPantryItems(
                    [buildInput(values, overrides)]
                )
                if (outcome.status === 'duplicate') {
                    setDuplicate(outcome)
                    return
                }
                router.push(routes.pantry)
            } catch (error) {
                console.error(error)
                form.setError('root', {
                    message: (
                        pantryTexts.addForm.saveError
                    )
                })
                toast.error(
                    pantryTexts.addForm.saveError
                )
            }
        })
    }

    const handleMerge = () => {
        if (!duplicate) return
        const mergeWithId = duplicate.existing._id
        setDuplicate(null)
        form.handleSubmit((values) => (
            submit(values, { mergeWithId })
        ))()
    }

    const handleKeepSeparate = () => {
        setDuplicate(null)
        form.handleSubmit((values) => (
            submit(values, { forceSeparate: true })
        ))()
    }

    return {
        form,
        suggestion: effectiveSuggestion,
        isSuggesting,
        isSubmitting,
        duplicate,
        setDuplicate,
        handleSubmit: form.handleSubmit(
            (values) => submit(values)
        ),
        handleMerge,
        handleKeepSeparate,
        applySuggestedStorage: () => {
            if (effectiveSuggestion) {
                form.setValue(
                    'storage',
                    effectiveSuggestion.suggestedStorage
                )
            }
        }
    }
}
