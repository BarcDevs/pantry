import { useMemo, useState, useTransition } from 'react'

import { toast } from 'sonner'

import type {
    Recipe,
    RecipeLibraryFilter,
    RecipeSortOption
} from '@/types/recipe'

import { normalizeName } from '@/lib/normalize-name'

import { recipesTexts } from '@/constants/texts/recipes'

import { deleteRecipe as deleteRecipeAction } from '@/actions/recipes/delete-recipe'
import { updateRecipe } from '@/actions/recipes/update-recipe'

const sortComparators: Record<RecipeSortOption, (a: Recipe, b: Recipe) => number> = {
    recent: () => 0,
    rating: (a, b) => (b.rating ?? -1) - (a.rating ?? -1),
    title: (a, b) => a.title.localeCompare(b.title, 'he')
}

const titleMatches = (recipe: Recipe, query: string) => normalizeName(recipe.title).includes(query)
const ingredientMatches = (recipe: Recipe, query: string) => (
    recipe.ingredients.some((ingredient) => normalizeName(ingredient.name).includes(query))
)

export const useRecipeLibrary = (initialRecipes: Recipe[]) => {
    const [recipes, setRecipes] = useState(initialRecipes)
    const [query, setQuery] = useState('')
    const [filter, setFilter] = useState<RecipeLibraryFilter>('all')
    const [sort, setSort] = useState<RecipeSortOption>('recent')
    const [, startToggling] = useTransition()

    const filteredRecipes = useMemo(() => {
        const trimmedQuery = normalizeName(query)
        const tabFiltered = recipes.filter((recipe) => {
            if (filter === 'can-cook') {
                return recipe.ingredients
                    .filter((ingredient) => !ingredient.optional)
                    .every((ingredient) => ingredient.inPantry)
            }
            if (filter === 'favorites') return recipe.isFavorite
            return true
        })

        if (!trimmedQuery) return [...tabFiltered].sort(sortComparators[sort])

        const byTitle = tabFiltered
            .filter((recipe) => titleMatches(recipe, trimmedQuery))
            .sort(sortComparators[sort])
        const byIngredientOnly = tabFiltered
            .filter((recipe) => !titleMatches(recipe, trimmedQuery) && ingredientMatches(recipe, trimmedQuery))
            .sort(sortComparators[sort])

        return [...byTitle, ...byIngredientOnly]
    }, [recipes, filter, query, sort])

    const toggleFavorite = (recipe: Recipe) => {
        const nextIsFavorite = !recipe.isFavorite
        setRecipes((current) => current.map((item) => (
            item._id === recipe._id
                ? { ...item, isFavorite: nextIsFavorite }
                : item
        )))

        startToggling(async () => {
            try {
                await updateRecipe(recipe._id, {
                    isFavorite: nextIsFavorite
                })
            } catch (error) {
                console.error(error)
                setRecipes((current) => current.map((item) => (
                    item._id === recipe._id
                        ? { ...item, isFavorite: recipe.isFavorite }
                        : item
                )))
                toast.error(recipesTexts.library.favoriteToggleError)
            }
        })
    }

    const deleteRecipe = async (recipe: Recipe) => {
        try {
            await deleteRecipeAction(recipe._id)
            setRecipes((current) => current.filter((item) => item._id !== recipe._id))
        } catch (error) {
            console.error(error)
            toast.error(recipesTexts.detail.deleteError)
            throw error
        }
    }

    return {
        query,
        setQuery,
        filter,
        setFilter,
        sort,
        setSort,
        filteredRecipes,
        toggleFavorite,
        deleteRecipe
    }
}
