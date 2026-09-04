import type { RecipeHistoryEntry }
    from '@/types/recipe'

export const computeAverageRating = (
    history: RecipeHistoryEntry[]
): number | null => {
    const ratedEntries = history.filter(
        (
            entry
        ): entry is RecipeHistoryEntry & { rating: number } =>
            entry.rating !== null
    )
    if (ratedEntries.length === 0) return null

    const sum = ratedEntries.reduce(
        (total, entry) => total + entry.rating,
        0
    )
    return Math.round(
        (sum / ratedEntries.length) * 10
    ) / 10
}
