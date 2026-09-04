import {
    useEffect,
    useState,
    useTransition
} from 'react'

import { toast } from 'sonner'

import type { Recipe } from '@/types/recipe'

import { recipesTexts } from '@/constants/texts/recipes'

import { getCookingHistory } from '@/actions/recipes/get-cooking-history'
import { updateHistoryEntryRating } from '@/actions/recipes/update-history-entry-rating'

export type CookingHistoryRow = {
    recipeId: string
    entryId: string
    name: string
    emoji?: string
    rating: number | null
    cookedAt: Date
}

const toRows = (recipes: Recipe[]): CookingHistoryRow[] => recipes
    .flatMap((recipe) => recipe.history.map((entry) => ({
        recipeId: recipe._id,
        entryId: entry.entryId,
        name: recipe.title,
        emoji: recipe.emoji,
        rating: entry.rating,
        cookedAt: new Date(entry.cookedAt)
    })))
    .sort((a, b) => b.cookedAt.getTime() - a.cookedAt.getTime())

export const useCookingHistory = () => {
    const [rows, setRows] = useState<CookingHistoryRow[] | null>(null)
    const [, startUpdating] = useTransition()

    useEffect(() => {
        getCookingHistory()
            .then((recipes) => setRows(toRows(recipes)))
            .catch(() => {
                toast.error(recipesTexts.history.updateError)
                setRows([])
            })
    }, [])

    const rate = (row: CookingHistoryRow, rating: number) => {
        setRows((prev) => prev?.map((current) => (
            current.entryId === row.entryId
                ? { ...current, rating }
                : current
        )) ?? null)

        startUpdating(async () => {
            try {
                await updateHistoryEntryRating(
                    row.recipeId,
                    row.entryId,
                    rating
                )
            } catch {
                setRows((prev) => prev?.map((current) => (
                    current.entryId === row.entryId
                        ? { ...current, rating: row.rating }
                        : current
                )) ?? null)
                toast.error(recipesTexts.history.updateError)
            }
        })
    }

    return { rows, rate }
}
