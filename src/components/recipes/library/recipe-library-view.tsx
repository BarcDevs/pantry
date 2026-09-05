'use client'

import type { Recipe } from '@/types/recipe'

import { RecipeFilterTabs } from '@/components/recipes/library/recipe-filter-tabs'
import { RecipeGrid } from '@/components/recipes/library/recipe-grid'
import { RecipeImportLink } from '@/components/recipes/library/recipe-import-link'
import { RecipeSearchInput } from '@/components/recipes/library/recipe-search-input'
import { EmptyStateCard } from '@/components/shared/EmptyStateCard'
import { SortSelect } from '@/components/shared/SortSelect'

import { useRecipeLibrary } from '@/hooks/use-recipe-library'

import { routes } from '@/constants/routes'
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
        sort,
        setSort,
        filteredRecipes,
        toggleFavorite
    } = useRecipeLibrary(recipes)

    if (recipes.length === 0) return (
        <EmptyStateCard
            icon={'🍽️'}
            title={recipesTexts.library.emptyTitle}
            subtitle={recipesTexts.library.emptySub}
            ctaHref={routes.generate}
            ctaLabel={recipesTexts.library.generateCta}
        />
    )

    return (
        <div>
            <div className={'mb-5.5 flex items-center justify-between gap-2'}>
                <p className={'text-body text-ink-3'}>
                    {recipesTexts.library.subtitle(recipes.length)}
                </p>
                <RecipeImportLink/>
            </div>
            <RecipeSearchInput
                value={query}
                onChange={setQuery}
            />
            <div className={'mb-4.5 flex flex-wrap items-center justify-between gap-2'}>
                <RecipeFilterTabs
                    value={filter}
                    onChange={setFilter}
                />
                <SortSelect
                    value={sort}
                    onChange={setSort}
                    label={recipesTexts.library.sortLabel}
                    options={[
                        { value: 'recent', label: recipesTexts.library.sortRecent },
                        { value: 'rating', label: recipesTexts.library.sortRating },
                        { value: 'title', label: recipesTexts.library.sortTitle }
                    ]}
                />
            </div>
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
