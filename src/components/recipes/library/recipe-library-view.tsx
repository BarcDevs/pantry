'use client'

import type { Recipe } from '@/types/recipe'

import { RecipeFilterTabs } from '@/components/recipes/library/recipe-filter-tabs'
import { RecipeGrid } from '@/components/recipes/library/recipe-grid'
import { RecipeLibraryEmptyState } from '@/components/recipes/library/recipe-library-empty-state'
import { RecipeSearchInput } from '@/components/recipes/library/recipe-search-input'

import { useRecipeLibrary } from '@/hooks/use-recipe-library'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeLibraryViewProps = {
    recipes: Recipe[]
}

export const RecipeLibraryView = ({ recipes }: RecipeLibraryViewProps) => {
    const {
        query,
        setQuery,
        filter,
        setFilter,
        filteredRecipes,
        toggleFavorite
    } = useRecipeLibrary(recipes)

    if (recipes.length === 0) return <RecipeLibraryEmptyState/>

    return (
        <div>
            <RecipeSearchInput
                value={query}
                onChange={setQuery}
            />
            <RecipeFilterTabs
                value={filter}
                onChange={setFilter}
            />
            {filteredRecipes.length === 0 ? (
                <p className={'py-10 text-center text-body text-ink-3'}>
                    {recipesTexts.library.noResults}
                </p>
            ) : (
                <RecipeGrid
                    recipes={filteredRecipes}
                    onToggleFavorite={toggleFavorite}
                />
            )}
        </div>
    )
}
