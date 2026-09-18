import type { StorageSuggestion } from '@/types/pantry-item'

const mockEntry = {
    date: '2099-01-01',
    reason: 'בדיקה'
}

export const mockStorageSuggestion = (): StorageSuggestion => ({
    recognized: true,
    suggestedStorage: 'pantry',
    suggestedType: null,
    reason: 'בדיקה',
    expiryByStorage: {
        fridge: mockEntry,
        freezer: mockEntry,
        pantry: mockEntry
    }
})
