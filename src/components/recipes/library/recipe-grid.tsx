import type { Recipe } from '@/types/recipe'

import { RecipeCard } from '@/components/recipes/shared/recipe-card'

type RecipeGridProps = {
    recipes: Recipe[]
    onToggleFavorite: (recipe: Recipe) => void
    onDelete: (recipe: Recipe) => Promise<void>
    isSelecting?: boolean
    selectedIds?: string[]
    onToggleSelect?: (recipe: Recipe) => void
}

export const RecipeGrid = ({
    recipes,
    onToggleFavorite,
    onDelete,
    isSelecting = false,
    selectedIds = [],
    onToggleSelect
}: RecipeGridProps) => (
    <div className={'grid grid-cols-2 gap-3 md:grid-cols-3'}>
        {recipes.map((recipe) => (
            <RecipeCard
                key={recipe._id}
                recipe={recipe}
                onToggleFavorite={() => onToggleFavorite(recipe)}
                onDelete={() => onDelete(recipe)}
                isSelecting={isSelecting}
                isSelected={selectedIds.includes(recipe._id)}
                onToggleSelect={() => onToggleSelect?.(recipe)}
            />
        ))}
    </div>
)
