import type { GenerateRecipeInput } from '@/types/recipe'

export const buildEnglishSearchQueryPrompt = (
    input: GenerateRecipeInput,
    ingredientNames: string[]
): string => `
    Compose ONE short English web-search query (max 12 words) that finds a
    recipe page for this request. The ingredient names below are in Hebrew -
    translate them. Return only the query text, no quotes or operators.
    Meal type: ${input.mealType}.
    Main ingredients: ${ingredientNames.join(', ') || 'none'}.
    Max total time: ${input.maxTime} minutes.
    ${input.customInstructions
        ? `Extra wishes from the user: ${input.customInstructions}`
        : ''}
`
