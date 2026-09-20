import {
    useCallback,
    useRef,
    useState,
    useTransition
} from 'react'

import type { StorageSuggestion } from '@/types/pantry-item'

import { minNameLengthForSuggestion } from '@/constants/pantry'

import { suggestStorage } from '@/actions/pantry/suggest-storage'

type RequestOptions = {
    fresh?: boolean
    onSuggested?: (suggestion: StorageSuggestion) => void
}

export const useStorageSuggestion = (
    initial: StorageSuggestion | null = null,
    initialName = ''
) => {
    const [suggestion, setSuggestion] = useState<StorageSuggestion | null>(initial)
    const [generatedForName, setGeneratedForName] = useState(initialName.trim())
    const [suggestionFailed, setSuggestionFailed] = useState(false)
    const [isSuggesting, startSuggesting] = useTransition()
    const latestRequestRef = useRef(0)

    const clear = useCallback(() => {
        latestRequestRef.current += 1
        setSuggestion(null)
        setSuggestionFailed(false)
    }, [])

    const isStaleFor = (currentName: string) => (
        suggestion !== null
        && currentName.trim() !== generatedForName
    )

    const request = useCallback((
        name: string,
        {
            fresh = false,
            onSuggested
        }: RequestOptions = {}
    ) => {
        const trimmedName = name.trim()
        if (trimmedName.length < minNameLengthForSuggestion) return

        latestRequestRef.current += 1
        const requestId = latestRequestRef.current
        startSuggesting(async () => {
            try {
                const result = await suggestStorage(trimmedName, { fresh })
                if (requestId !== latestRequestRef.current) return
                setSuggestion(result)
                setGeneratedForName(trimmedName)
                setSuggestionFailed(false)
                onSuggested?.(result)
            } catch (error) {
                console.error(error)
                if (requestId !== latestRequestRef.current) return
                setSuggestion(null)
                setSuggestionFailed(true)
            }
        })
    }, [])

    return {
        suggestion,
        suggestionFailed,
        isSuggesting,
        isStaleFor,
        request,
        clear
    }
}
