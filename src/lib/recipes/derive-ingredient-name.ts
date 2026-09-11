import { stripPrepWords } from '@/lib/recipes/ingredient-name-words'

/**
 * The pantry-matching `name` is never accepted from the AI - it repeatedly
 * either dropped real distinguishing words (garlic powder -> garlic) or
 * rewrote it to match a pantry item outright (green pepper -> red pepper),
 * both causing false pantry matches. It is always derived deterministically
 * from the display `label` by stripping known prep/state words only.
 */
export const deriveIngredientName = (label: string): string => stripPrepWords(label)
