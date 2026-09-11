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

export const findRelatedPantryItem = <T extends { name: string, type: FoodType | null }>(
    ingredientName: string,
    ingredientCategory: FoodType | undefined,
    pantryItems: T[]
): T | undefined => {
    const normalizedIngredient = normalizeItemName(ingredientName)
    const ingredientWords = nameWords(ingredientName)
    const ingredientCoreWords = nameWordsForMatching(ingredientName)

    return pantryItems.find((item) => {
        if (
            ingredientCategory !== undefined
            && item.type !== null
            && item.type !== ingredientCategory
        ) return false
        if (normalizeItemName(item.name) === normalizedIngredient) return false

        const itemWords = nameWords(item.name)
        // Color-only differences (green pepper / red pepper) are interchangeable -
        // checked as an exact match once color words are stripped from both sides,
        // separately from the general coverage check below (which must run on the
        // full, un-stripped words - otherwise "black pepper" reduces to the same
        // bare "pepper" as "red pepper" and would wrongly match it too).
        if (sameWordSet(ingredientCoreWords, nameWordsForMatching(item.name))) return true

        return wordsCoveredBy(ingredientWords, itemWords) || wordsCoveredBy(itemWords, ingredientWords)
    })
}

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
