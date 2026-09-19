import type { RecipeIngredient } from '@/types/recipe'

export const resolveReplacementChoice = (
    ingredient: Pick<RecipeIngredient, 'replacementName' | 'replacementOptions'>,
    chosenName?: string
): string | undefined => {
    const options = ingredient.replacementOptions ?? []
    return chosenName && options.includes(chosenName)
        ? chosenName
        : ingredient.replacementName
}
