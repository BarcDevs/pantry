import type { FoodType } from '@/types/enums'
import type { StorageSuggestion } from '@/types/pantry-item'

export const resolveSuggestedType = (
    suggestion: StorageSuggestion,
    currentType: FoodType | null,
    isFresh: boolean
): FoodType | null => {
    if (!suggestion.suggestedType) return null
    return isFresh || !currentType
        ? suggestion.suggestedType
        : null
}
