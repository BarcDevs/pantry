import type { StorageSuggestion } from '@/types/pantry-item'

import { resolveSuggestedName } from './resolve-suggested-name'

const suggestion = (suggestedName?: string | null) => ({
    recognized: true,
    suggestedStorage: 'fridge',
    suggestedName,
    reason: 'test',
    expiryByStorage: {}
}) as unknown as StorageSuggestion

describe('resolveSuggestedName', () => {
    it('returns the correction when it differs from the typed name', () => {
        expect(resolveSuggestedName(suggestion('עגבניה'), 'עגבניות'))
            .toBe('עגבניה')
    })

    it('returns null when the suggestion matches the typed name', () => {
        expect(resolveSuggestedName(suggestion('עגבניה'), 'עגבניה'))
            .toBeNull()
    })

    it('returns null when nothing was suggested', () => {
        expect(resolveSuggestedName(suggestion(null), 'עגבניה'))
            .toBeNull()
    })

    it('ignores surrounding whitespace when comparing', () => {
        expect(resolveSuggestedName(suggestion('עגבניה'), ' עגבניה '))
            .toBeNull()
    })
})
