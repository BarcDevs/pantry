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
    PantryUnit,
    StorageLocation } from '@/types/enums'
import type {
    AddPantryItemInput,
    AddPantryItemOutcome,
    StorageSuggestion
} from '@/types/pantry-item'

import { useDebouncedValue }
    from '@/hooks/use-debounced-value'
import { useResetOnChange }
    from '@/hooks/use-reset-on-change'

import { applySuggestedExpiry }
    from '@/lib/pantry/apply-suggested-expiry'
import type { AddItemPrefill } from '@/lib/pantry/parse-add-item-prefill'

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

export const useAddItemForm = (prefill: AddItemPrefill = {}) => {
    const router = useRouter()

    const form = useForm<AddItemFormValues>({
        resolver: zodResolver(addItemFormSchema),
        defaultValues: {
            name: prefill.name ?? '',
            storage: StorageLocation.Fridge,
            type: null,
            quantity: prefill.quantity ?? 1,
            unit: prefill.unit ?? PantryUnit.Units,
            expiryDate: '',
            notes: ''
        }
    })

    const [suggestion, setSuggestion] = useState<
        StorageSuggestion | null
    >(null)
    const [suggestionFailed, setSuggestionFailed] = useState(false)
    const [retryToken, setRetryToken] = useState(0)
    const [isSuggesting, startSuggesting] = useTransition()
    const [isSubmitting, startSubmitting] = useTransition()
    const [duplicate, setDuplicate] = useState<
        DuplicateOutcome | null
    >(null)
    const [isTypePickerOpen, setIsTypePickerOpen] = useState(false)
    const [pendingValues, setPendingValues] = useState<
        AddItemFormValues | null
    >(null)

    const name = useWatch({
        control: form.control,
        name: 'name'
    })
    const debouncedName = useDebouncedValue(
        name.trim(),
        nameDebounceMs
    )

    useResetOnChange(name, () => {
        setSuggestion(null)
        setSuggestionFailed(false)
    })

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
                if (cancelled) return
                setSuggestion(result)
                setSuggestionFailed(false)
                if (
                    result.suggestedType
                    && !form.getValues('type')
                ) {
                    form.setValue(
                        'type',
                        result.suggestedType
                    )
                }
            } catch (error) {
                console.error(error)
                if (!cancelled) {
                    setSuggestion(null)
                    setSuggestionFailed(true)
                }
            }
        })

        return () => { cancelled = true }
    }, [debouncedName, retryToken, form])

    const isNameLongEnough = (
        name.trim().length >= minNameLengthForSuggestion
    )
    const isPendingSuggestion = isNameLongEnough && (
        isSuggesting || debouncedName !== name.trim()
    )
    const effectiveSuggestion = isNameLongEnough
        ? suggestion
        : null

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
                toast.success(pantryTexts.addForm.saveSuccess)
                router.push(prefill.returnTo ?? routes.pantry)
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
        isSuggesting: isPendingSuggestion,
        suggestionFailed,
        retrySuggestion: () => setRetryToken((token) => token + 1),
        isSubmitting,
        duplicate,
        setDuplicate,
        isTypePickerOpen,
        setIsTypePickerOpen,
        handleSubmit: form.handleSubmit((values) => {
            if (!values.type) {
                setPendingValues(values)
                setIsTypePickerOpen(true)
                return
            }
            submit(values)
        }),
        handleMerge,
        handleKeepSeparate,
        applySuggestedStorage: () => {
            if (effectiveSuggestion) {
                form.setValue(
                    'storage',
                    effectiveSuggestion.suggestedStorage
                )
            }
        },
        applySuggestedExpiry: () => (
            applySuggestedExpiry(form, effectiveSuggestion)
        ),
        // Submits the values snapshotted when the type picker opened, not live form state -
        // the picker is modal, so nothing else can change while it's open.
        selectPendingType: (
            type: NonNullable<AddItemFormValues['type']>
        ) => {
            form.setValue('type', type)
            setIsTypePickerOpen(false)
            if (pendingValues) submit({ ...pendingValues, type })
        },
        skipPendingType: () => {
            setIsTypePickerOpen(false)
            if (pendingValues) submit(pendingValues)
        }
    }
}
