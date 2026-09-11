import type { RecipeStep } from '@/types/recipe'

const FRACTION_WORD_REPLACEMENTS: Array<[RegExp, string]> = [
    [/(?<!\d)1\/2(?!\d)/g, 'חצי'],
    [/(?<!\d)1\/4(?!\d)/g, 'רבע'],
    [/(?<!\d)0\.5(?!\d)/g, 'חצי'],
    [/(?<!\d)0\.25(?!\d)/g, 'רבע']
]

export const normalizeFractionWords = (text: string): string => (
    FRACTION_WORD_REPLACEMENTS.reduce(
        (result, [pattern, replacement]) => result.replace(pattern, replacement),
        text
    )
)

export const normalizeStepFractions = (steps: RecipeStep[]): RecipeStep[] => (
    steps.map((step) => ({
        ...step,
        description: normalizeFractionWords(step.description)
    }))
)

export const normalizeIngredientFractions = <T extends { label: string }>(
    ingredients: T[]
): T[] => (
    ingredients.map((ingredient) => ({
        ...ingredient,
        label: normalizeFractionWords(ingredient.label)
    }))
)
