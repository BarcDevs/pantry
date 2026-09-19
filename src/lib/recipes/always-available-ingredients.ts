import { rawNameWords } from '@/lib/recipes/ingredient-name-words'

const ALWAYS_AVAILABLE_FIRST_WORDS = new Set([
    'מים',
    'water'
])

export const isAlwaysAvailableIngredient = (label: string): boolean => {
    const [firstWord = ''] = rawNameWords(label.toLowerCase())
    return ALWAYS_AVAILABLE_FIRST_WORDS.has(firstWord)
}
