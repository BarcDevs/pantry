import type { RecipeIngredient } from '@/types/recipe'

import { RecipeIngredientRow } from '@/components/recipes/result/recipe-ingredient-row'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeIngredientsListProps = {
    ingredients: RecipeIngredient[]
}

export const RecipeIngredientsList = ({
    ingredients
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
                />
            ))}
        </div>
    </div>
)
