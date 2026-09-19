import {
    useEffect,
    useRef,
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
    ExistingPantryItem
} from '@/types/pantry-item'

import { useDebouncedValue }
    from '@/hooks/use-debounced-value'
import { useExistingPantryItem } from '@/hooks/use-existing-pantry-item'
import { useResetOnChange }
    from '@/hooks/use-reset-on-change'
import { useStorageSuggestion } from '@/hooks/use-storage-suggestion'

import { applySuggestedExpiry }
    from '@/lib/pantry/apply-suggested-expiry'
import type { AddItemPrefill } from '@/lib/pantry/parse-add-item-prefill'

import { minNameLengthForSuggestion } from '@/constants/pantry'
import { routes }
    from '@/constants/routes'
import { pantryTexts }
    from '@/constants/texts/pantry'

import { addPantryItems }
    from '@/actions/pantry/add-pantry-items'
import {
    addItemFormSchema,
    type AddItemFormValues
} from '@/schemas/add-item-form'

export type MergePrompt = {
    existing: ExistingPantryItem
    isMerging: boolean
    addedQuantity: number
    total: number
}

type DuplicateOutcome = Extract<
    AddPantryItemOutcome,
    { status: 'duplicate' }
>

const nameDebounceMs = 500

export const useAddItemForm = (prefill: AddItemPrefill = {}) => {
    const router = useRouter()

    const form = useForm<AddItemFormValues>({
        resolver: zodResolver(addItemFormSchema),
        defaultValues: {
            name: prefill.name ?? '',
            storage: StorageLocation.Pantry,
            type: null,
            quantity: prefill.quantity ?? 1,
            unit: prefill.unit ?? PantryUnit.Units,
            expiryDate: '',
            notes: ''
        }
    })

    const isStorageChosenRef = useRef(false)
    const isFreshRequestedRef = useRef(false)
    const {
        suggestion,
        suggestionFailed,
        isSuggesting,
        request: requestSuggestion,
        clear: clearSuggestion
    } = useStorageSuggestion()
    const [retryToken, setRetryToken] = useState(0)
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

    useEffect(() => form.subscribe({
        name: 'storage',
        formState: { values: true },
        callback: ({ type }) => {
            if (type === 'change') isStorageChosenRef.current = true
        }
    }), [form])

    const unit = useWatch({
        control: form.control,
        name: 'unit'
    })
    const quantity = useWatch({
        control: form.control,
        name: 'quantity'
    })
    const existingItem = useExistingPantryItem(debouncedName)
    const [isMergeRequested, setIsMergeRequested] = useState(false)

    useResetOnChange(name, () => {
        clearSuggestion()
        setIsMergeRequested(false)
    })

    useEffect(() => {
        if (debouncedName.length < minNameLengthForSuggestion) return

        const fresh = isFreshRequestedRef.current
        isFreshRequestedRef.current = false
        requestSuggestion(debouncedName, {
            fresh,
            onSuggested: (result) => {
                if (!isStorageChosenRef.current) {
                    form.setValue('storage', result.suggestedStorage)
                }
                if (result.suggestedType && !form.getValues('type')) {
                    form.setValue('type', result.suggestedType)
                }
            }
        })
    }, [debouncedName, retryToken, form, requestSuggestion])

    const isNameLongEnough = (
        name.trim().length >= minNameLengthForSuggestion
    )
    const isPendingSuggestion = isNameLongEnough && (
        isSuggesting || debouncedName !== name.trim()
    )
    const effectiveSuggestion = isNameLongEnough
        ? suggestion
        : null

    const mergeCandidate = (
        existingItem
        && debouncedName === name.trim()
        && existingItem.unit === unit
    ) ? existingItem : null
    const isMerging = isMergeRequested && mergeCandidate !== null
    const addedQuantity = Number(quantity) || 0
    const mergePrompt: MergePrompt | null = mergeCandidate
        ? {
            existing: mergeCandidate,
            isMerging,
            addedQuantity,
            total: Math.round((mergeCandidate.quantity + addedQuantity) * 100) / 100
        }
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
        mergePrompt,
        startMerge: () => setIsMergeRequested(true),
        cancelMerge: () => setIsMergeRequested(false),
        suggestion: effectiveSuggestion,
        isSuggesting: isPendingSuggestion,
        suggestionFailed,
        retrySuggestion: () => {
            isFreshRequestedRef.current = true
            setRetryToken((token) => token + 1)
        },
        isSubmitting,
        duplicate,
        setDuplicate,
        isTypePickerOpen,
        setIsTypePickerOpen,
        handleSubmit: form.handleSubmit((values) => {
            if (isMerging && mergeCandidate) {
                submit(values, { mergeWithId: mergeCandidate._id })
                return
            }
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
