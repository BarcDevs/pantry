import type { Recipe } from '@/types/recipe'

import { RecipeCard } from '@/components/recipes/shared/recipe-card'

type RecipeGridProps = {
    recipes: Recipe[]
    onToggleFavorite: (recipe: Recipe) => void
}

export const RecipeGrid = ({
    recipes,
    onToggleFavorite
}: RecipeGridProps) => (
    <div className={'grid grid-cols-2 gap-3 md:grid-cols-3'}>
        {recipes.map((recipe) => (
            <RecipeCard
                key={recipe._id}
                recipe={recipe}
                onToggleFavorite={() => onToggleFavorite(recipe)}
            />
        ))}
    </div>
)
