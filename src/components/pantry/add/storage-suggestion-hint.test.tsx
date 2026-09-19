import {
    fireEvent,
    render,
    screen
} from '@testing-library/react'

import { StorageLocation } from '@/types/enums'
import type { StorageSuggestion } from '@/types/pantry-item'

import { StorageSuggestionHint } from './storage-suggestion-hint'

const entry = {
    date: '2030-01-01',
    reason: 'סיבה'
}

const suggestion: StorageSuggestion = {
    recognized: true,
    suggestedStorage: StorageLocation.Fridge,
    reason: 'סיבה',
    expiryByStorage: {
        fridge: entry,
        freezer: entry,
        pantry: entry
    }
}

const renderHint = (overrides: Partial<Parameters<typeof StorageSuggestionHint>[0]> = {}) => {
    const onRefresh = jest.fn()
    render(
        <StorageSuggestionHint
            isLoading={false}
            suggestion={suggestion}
            suggestionFailed={false}
            currentStorage={StorageLocation.Fridge}
            onSelectRecommended={jest.fn()}
            onApplyExpiry={jest.fn()}
            onRetry={jest.fn()}
            onRefresh={onRefresh}
            {...overrides}
        />
    )
    return onRefresh
}

describe('StorageSuggestionHint refresh', () => {
    it('requests a new suggestion when the refresh button is clicked', () => {
        const onRefresh = renderHint()

        fireEvent.click(screen.getByRole('button', { name: 'רענון ההצעה' }))

        expect(onRefresh).toHaveBeenCalledTimes(1)
    })

    it('hides the refresh button while a suggestion is loading', () => {
        renderHint({ isLoading: true })

        expect(screen.queryByRole('button', { name: 'רענון ההצעה' })).not.toBeInTheDocument()
    })

    it('has no refresh button before a suggestion exists', () => {
        renderHint({ suggestion: null })

        expect(screen.queryByRole('button', { name: 'רענון ההצעה' })).not.toBeInTheDocument()
    })
})
