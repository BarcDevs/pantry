import type { RecipeIngredient } from '@/types/recipe'

import { RecipeIngredientRow } from '@/components/recipes/result/recipe-ingredient-row'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeIngredientsListProps = {
    ingredients: RecipeIngredient[]
    usedReplacements?: Record<string, boolean>
    onToggleReplacement?: (ingredientName: string, replacementName: string) => void
    usedRemovals?: Record<string, boolean>
    onToggleRemoval?: (ingredientName: string) => void
}

export const RecipeIngredientsList = ({
    ingredients,
    usedReplacements = {},
    onToggleReplacement,
    usedRemovals = {},
    onToggleRemoval
}: RecipeIngredientsListProps) => (
    <div>
        <div className={'mb-3 font-display text-heading font-weight-heading text-ink'}>
            {recipesTexts.result.ingredientsTitle}
        </div>
        <div className={'rounded-lg border border-border bg-surface px-4'}>
            {ingredients.map((ingredient) => (
                <RecipeIngredientRow
                    key={ingredient.name}
                    ingredient={ingredient}
                    isReplacementAdded={!!usedReplacements[ingredient.name]}
                    onToggleReplacement={onToggleReplacement && ingredient.replacementName
                        ? () => onToggleReplacement(ingredient.name, ingredient.replacementName!)
                        : undefined}
                    isRemovalAdded={!!usedRemovals[ingredient.name]}
                    onToggleRemoval={onToggleRemoval
                        ? () => onToggleRemoval(ingredient.name)
                        : undefined}
                />
            ))}
        </div>
    </div>
)
