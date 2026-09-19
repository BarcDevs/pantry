'use client'

import { useState } from 'react'

import type { Recipe } from '@/types/recipe'

import { BulkDeleteDialog } from '@/components/recipes/library/bulk-delete-dialog'
import { RecipeFilterTabs } from '@/components/recipes/library/recipe-filter-tabs'
import { RecipeGrid } from '@/components/recipes/library/recipe-grid'
import { RecipeImportLink } from '@/components/recipes/library/recipe-import-link'
import { RecipeSearchInput } from '@/components/recipes/library/recipe-search-input'
import { RecipeSelectionBar } from '@/components/recipes/library/recipe-selection-bar'
import { EmptyStateCard } from '@/components/shared/EmptyStateCard'
import { SortSelect } from '@/components/shared/SortSelect'

import { useRecipeLibrary } from '@/hooks/use-recipe-library'

import { routes } from '@/constants/routes'
import { recipesTexts } from '@/constants/texts/recipes'

type RecipeLibraryViewProps = {
    recipes: Recipe[]
}

export const RecipeLibraryView = ({ recipes }: RecipeLibraryViewProps) => {
    const [isDeleting, setIsDeleting] = useState(false)
    const [confirmBulkDelete, setConfirmBulkDelete] = useState(false)
    const recipeLibrary = useRecipeLibrary(recipes)

    const handleBulkDelete = async () => {
        setIsDeleting(true)
        try {
            await recipeLibrary.selection.deleteSelected()
            setConfirmBulkDelete(false)
        } catch {
            setIsDeleting(false)
        }
    }

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
                value={recipeLibrary.values.query}
                onChange={(value) => recipeLibrary.setField('query', value)}
            />
            <div className={'mb-4.5 flex flex-wrap items-center justify-between gap-2'}>
                <RecipeFilterTabs
                    value={recipeLibrary.values.filter}
                    onChange={(value) => recipeLibrary.setField('filter', value)}
                />
                <SortSelect
                    value={recipeLibrary.values.sort}
                    onChange={(value) => recipeLibrary.setField('sort', value)}
                    label={recipesTexts.library.sortLabel}
                    options={[
                        { value: 'recent', label: recipesTexts.library.sortRecent },
                        { value: 'rating', label: recipesTexts.library.sortRating },
                        { value: 'title', label: recipesTexts.library.sortTitle }
                    ]}
                />
            </div>
            <RecipeSelectionBar
                isSelecting={recipeLibrary.selection.isSelecting}
                selectedCount={recipeLibrary.selection.selectedIds.length}
                onToggleSelectMode={recipeLibrary.selection.toggleMode}
                onRequestDelete={() => setConfirmBulkDelete(true)}
            />
            {recipeLibrary.recipes.filtered.length === 0 ? (
                <p className={'py-10 text-center text-body text-ink-3'}>
                    {recipesTexts.library.noResults}
                </p>
            ) : (
                <RecipeGrid
                    recipes={recipeLibrary.recipes.filtered}
                    onToggleFavorite={recipeLibrary.recipes.toggleFavorite}
                    onDelete={recipeLibrary.recipes.remove}
                    isSelecting={recipeLibrary.selection.isSelecting}
                    selectedIds={recipeLibrary.selection.selectedIds}
                    onToggleSelect={(recipe) => (
                        recipeLibrary.selection.toggle(recipe._id)
                    )}
                />
            )}
            <BulkDeleteDialog
                open={confirmBulkDelete}
                onOpenChange={setConfirmBulkDelete}
                onConfirm={handleBulkDelete}
                isDeleting={isDeleting}
                count={recipeLibrary.selection.selectedIds.length}
            />
        </div>
    )
}
