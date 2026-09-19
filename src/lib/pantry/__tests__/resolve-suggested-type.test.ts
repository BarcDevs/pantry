import { FoodType } from '@/types/enums'
import type { StorageSuggestion } from '@/types/pantry-item'

import { resolveSuggestedType } from '../resolve-suggested-type'

const suggestion = (suggestedType?: FoodType) => ({
    recognized: true,
    suggestedStorage: 'fridge',
    suggestedType,
    reason: 'test',
    expiryByStorage: {}
}) as unknown as StorageSuggestion

describe('resolveSuggestedType', () => {
    it('fills an empty type', () => {
        expect(resolveSuggestedType(
            suggestion(FoodType.Dairy), null, false))
            .toBe(FoodType.Dairy)
    })

    it('keeps a type the user already set', () => {
        expect(resolveSuggestedType(
            suggestion(FoodType.Dairy), FoodType.Meat, false))
            .toBeNull()
    })

    it('replaces a set type on a fresh request', () => {
        expect(resolveSuggestedType(
            suggestion(FoodType.Dairy), FoodType.Meat, true))
            .toBe(FoodType.Dairy)
    })

    it('returns null when the suggestion has no type', () => {
        expect(resolveSuggestedType(
            suggestion(), null, true)).toBeNull()
    })
})
