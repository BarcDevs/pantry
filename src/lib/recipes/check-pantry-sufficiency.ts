import type {
    CookingUnit,
    FoodType,
    PantryUnit
} from '@/types/enums'

import {
    nameWords,
    nameWordsForMatching,
    normalizeItemName
} from '@/lib/recipes/ingredient-name-words'
import { resolveQuantityNumber } from '@/lib/recipes/resolve-quantity-number'

type UnitFamily = 'weight' | 'volume' | 'other'

const WEIGHT_TO_GRAMS: Partial<Record<CookingUnit | PantryUnit, number>> = {
    kg: 1000,
    g: 1
}

const VOLUME_TO_ML: Partial<Record<CookingUnit | PantryUnit, number>> = {
    L: 1000,
    ml: 1
}

const toBaseAmount = (
    quantity: number,
    unit: CookingUnit | PantryUnit
): { family: UnitFamily, amount: number } => {
    if (unit in WEIGHT_TO_GRAMS) return { family: 'weight', amount: quantity * WEIGHT_TO_GRAMS[unit]! }
    if (unit in VOLUME_TO_ML) return { family: 'volume', amount: quantity * VOLUME_TO_ML[unit]! }
    return { family: 'other', amount: quantity }
}

export const findMatchingPantryItem = <T extends { name: string }>(
    ingredientName: string,
    pantryItems: T[]
): T | undefined => {
    const normalized = normalizeItemName(ingredientName)
    return pantryItems.find((item) => normalizeItemName(item.name) === normalized)
}

const wordsRelate = (wordA: string, wordB: string): boolean => (
    wordA.includes(wordB) || wordB.includes(wordA)
)

const wordsCoveredBy = (words: string[], otherWords: string[]): boolean => (
    words.every((word) => otherWords.some((otherWord) => wordsRelate(word, otherWord)))
)

const sameWordSet = (words: string[], otherWords: string[]): boolean => (
    words.length > 0
    && words.length === otherWords.length
    && wordsCoveredBy(words, otherWords)
    && wordsCoveredBy(otherWords, words)
)

const colorOnlyBonus = 0.25

type RelatedCandidate<T> = {
    item: T
    score: number
    lengthGap: number
}

const closeness = (words: string[], otherWords: string[]): number => {
    const sharedCount = words.filter(
        (word) => otherWords.some((otherWord) => wordsRelate(word, otherWord))
    ).length
    return sharedCount / Math.max(words.length, otherWords.length) || 1
}

/**
 * Every pantry item that can stand in for the ingredient, closest match first: the
 * more words two names share, the closer they are (a color-only variant like green vs
 * red pepper gets a small bonus), then the smaller name-length gap wins, then pantry
 * order. The first entry is the default suggestion; the rest are alternatives.
 */
export const findRelatedPantryItems = <T extends { name: string, type: FoodType | null }>(
    ingredientName: string,
    ingredientCategory: FoodType | undefined,
    pantryItems: T[]
): T[] => {
    const normalizedIngredient = normalizeItemName(ingredientName)
    const ingredientWords = nameWords(ingredientName)
    const ingredientCoreWords = nameWordsForMatching(ingredientName)
    const candidates: Array<RelatedCandidate<T>> = []

    pantryItems.forEach((item) => {
        if (
            ingredientCategory !== undefined
            && item.type !== null
            && item.type !== ingredientCategory
        ) return
        if (normalizeItemName(item.name) === normalizedIngredient) return

        const itemWords = nameWords(item.name)
        // Color-only differences (green pepper / red pepper) are interchangeable -
        // checked as an exact match once color words are stripped from both sides,
        // separately from the general coverage check below (which must run on the
        // full, un-stripped words - otherwise "black pepper" reduces to the same
        // bare "pepper" as "red pepper" and would wrongly match it too).
        const isColorOnlyMatch = sameWordSet(ingredientCoreWords, nameWordsForMatching(item.name))
        const isCovered = wordsCoveredBy(ingredientWords, itemWords)
            || wordsCoveredBy(itemWords, ingredientWords)
        if (!isColorOnlyMatch && !isCovered) return

        candidates.push({
            item,
            score: closeness(ingredientWords, itemWords) + (isColorOnlyMatch ? colorOnlyBonus : 0),
            lengthGap: Math.abs(item.name.length - ingredientName.length)
        })
    })

    return candidates
        .sort((a, b) => b.score - a.score || a.lengthGap - b.lengthGap)
        .map((candidate) => candidate.item)
}

export const findRelatedPantryItem = <T extends { name: string, type: FoodType | null }>(
    ingredientName: string,
    ingredientCategory: FoodType | undefined,
    pantryItems: T[]
): T | undefined => findRelatedPantryItems(
    ingredientName,
    ingredientCategory,
    pantryItems
)[0]

export const hasEnoughPantryQuantity = (
    ingredientQuantity: number | string,
    ingredientUnit: CookingUnit,
    pantryQuantity: number,
    pantryUnit: PantryUnit
): boolean => {
    const neededQuantity = resolveQuantityNumber(ingredientQuantity)

    if (ingredientUnit === pantryUnit) {
        return pantryQuantity >= neededQuantity
    }

    const needed = toBaseAmount(neededQuantity, ingredientUnit)
    const available = toBaseAmount(pantryQuantity, pantryUnit)

    if (needed.family === 'other' || needed.family !== available.family) {
        return true
    }

    return available.amount >= needed.amount
}
