import type { RecipeIngredient } from '@/types/recipe'

import { RecipeIngredientRow } from '@/components/recipes/result/recipe-ingredient-row'

import { resolveReplacementChoice } from '@/lib/recipes/resolve-replacement-choice'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeIngredientsListProps = {
    ingredients: RecipeIngredient[]
    usedReplacements?: Record<string, boolean>
    onToggleReplacement?: (ingredientName: string, ingredientLabel: string, replacementName: string) => void
    chosenReplacements?: Record<string, string>
    onChooseReplacement?: (
        ingredientName: string,
        ingredientLabel: string,
        currentName: string,
        chosenName: string
    ) => void
    usedRemovals?: Record<string, boolean>
    onToggleRemoval?: (ingredientName: string, ingredientLabel: string) => void
}

export const RecipeIngredientsList = ({
    ingredients,
    usedReplacements = {},
    onToggleReplacement,
    chosenReplacements = {},
    onChooseReplacement,
    usedRemovals = {},
    onToggleRemoval
}: RecipeIngredientsListProps) => (
    <div>
        <div className={'mb-3 font-display text-heading font-weight-heading text-ink'}>
            {recipesTexts.result.ingredientsTitle}
        </div>
        <div className={'rounded-lg border border-border bg-surface px-4'}>
            {ingredients.map((ingredient) => {
                const replacementName = resolveReplacementChoice(
                    ingredient,
                    chosenReplacements[ingredient.name]
                )

                return (
                    <RecipeIngredientRow
                        key={ingredient.name}
                        ingredient={{
                            ...ingredient,
                            replacementName
                        }}
                        isReplacementAdded={!!usedReplacements[ingredient.name]}
                        onToggleReplacement={onToggleReplacement && replacementName
                            ? () => onToggleReplacement(
                                ingredient.name,
                                ingredient.label,
                                replacementName
                            )
                            : undefined}
                        onChooseReplacement={onChooseReplacement && replacementName
                            ? (chosenName) => onChooseReplacement(
                                ingredient.name,
                                ingredient.label,
                                replacementName,
                                chosenName
                            )
                            : undefined}
                        isRemovalAdded={!!usedRemovals[ingredient.name]}
                        onToggleRemoval={onToggleRemoval
                            ? () => onToggleRemoval(ingredient.name, ingredient.label)
                            : undefined}
                    />
                )
            })}
        </div>
    </div>
)
