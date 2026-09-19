import {
    useEffect,
    useState
} from 'react'

import type { ExistingPantryItem } from '@/types/pantry-item'

import { minNameLengthForSuggestion } from '@/constants/pantry'

import { findExistingPantryItem } from '@/actions/pantry/find-existing-pantry-item'

type LookupResult = {
    name: string
    item: ExistingPantryItem | null
}

export const useExistingPantryItem = (
    name: string
): ExistingPantryItem | null => {
    const [result, setResult] = useState<LookupResult | null>(null)

    useEffect(() => {
        if (name.length < minNameLengthForSuggestion) return

        let cancelled = false
        findExistingPantryItem(name)
            .then((item) => {
                if (!cancelled) setResult({ name, item })
            })
            .catch((error: unknown) => console.error(error))

        return () => { cancelled = true }
    }, [name])

    return result?.name === name ? result.item : null
}
