import {
    useEffect,
    useState,
    useTransition
} from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'sonner'

import type {
    FoodType as FoodTypeValue,
    StorageLocation as StorageLocationValue,
    Unit as UnitValue
} from '@/types/enums'
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

import { useDebouncedValue } from '@/hooks/use-debounced-value'

import { routes } from '@/constants/routes'
import { pantryTexts } from '@/constants/texts/pantry'

import { addPantryItems } from '@/actions/pantry/add-pantry-items'
import { suggestStorage } from '@/actions/pantry/suggest-storage'

type DuplicateOutcome = Extract<AddPantryItemOutcome, { status: 'duplicate' }>

const nameDebounceMs = 500
const minNameLengthForSuggestion = 2

export const useAddItemForm = () => {
    const router = useRouter()

    const [name, setName] = useState('')
    const [storage, setStorage] = useState<StorageLocationValue>(StorageLocation.Fridge)
    const [type, setType] = useState<FoodTypeValue>(FoodType.Other)
    const [quantity, setQuantity] = useState(1)
    const [unit, setUnit] = useState<UnitValue>(Unit.Units)
    const [expiryDate, setExpiryDate] = useState('')
    const [notes, setNotes] = useState('')

    const [suggestion, setSuggestion] = useState<StorageSuggestion | null>(null)
    const [isSuggesting, startSuggesting] = useTransition()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [duplicate, setDuplicate] = useState<DuplicateOutcome | null>(null)

    const debouncedName = useDebouncedValue(name.trim(), nameDebounceMs)

    useEffect(() => {
        if (debouncedName.length < minNameLengthForSuggestion) return

        let cancelled = false
        startSuggesting(async () => {
            try {
                const result = await suggestStorage(debouncedName)
                if (!cancelled) setSuggestion(result)
            } catch (error) {
                console.error(error)
                if (!cancelled) setSuggestion(null)
            }
        })

        return () => { cancelled = true }
    }, [debouncedName])

    const handleNameChange = (value: string) => {
        setName(value)
        if (value.trim().length < minNameLengthForSuggestion) setSuggestion(null)
    }

    const buildInput = (overrides?: Partial<AddPantryItemInput>): AddPantryItemInput => ({
        name: name.trim(),
        storage,
        type,
        quantity,
        unit,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        notes: notes.trim() || undefined,
        storageSuggestion: suggestion,
        ...overrides
    })

    const submit = async (overrides?: Partial<AddPantryItemInput>) => {
        setIsSubmitting(true)
        try {
            const [outcome] = await addPantryItems([buildInput(overrides)])
            if (outcome.status === 'duplicate') {
                setDuplicate(outcome)
                return
            }
            router.push(routes.pantry)
        } catch (error) {
            console.error(error)
            toast.error(pantryTexts.addForm.saveError)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleMerge = () => {
        if (!duplicate) return
        setDuplicate(null)
        void submit({ mergeWithId: duplicate.existing._id })
    }

    const handleKeepSeparate = () => {
        setDuplicate(null)
        void submit({ forceSeparate: true })
    }

    return {
        values: {
            name,
            storage,
            type,
            quantity,
            unit,
            expiryDate,
            notes
        },
        handlers: {
            setName: handleNameChange,
            setStorage,
            setType,
            setQuantity,
            setUnit,
            setExpiryDate,
            setNotes
        },
        suggestion,
        isSuggesting,
        isSubmitting,
        duplicate,
        setDuplicate,
        handleSubmit: () => void submit(),
        handleMerge,
        handleKeepSeparate,
        applySuggestedStorage: () => {
            if (suggestion) setStorage(suggestion.suggestedStorage)
        }
    }
}
