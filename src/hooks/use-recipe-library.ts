import { useMemo, useState, useTransition } from 'react'

import { toast } from 'sonner'

import type {
    Recipe,
    RecipeLibraryFilter
} from '@/types/recipe'

import { recipesTexts } from '@/constants/texts/recipes'

import { updateRecipe } from '@/actions/recipes/update-recipe'

export const useRecipeLibrary = (initialRecipes: Recipe[]) => {
    const [recipes, setRecipes] = useState(initialRecipes)
    const [query, setQuery] = useState('')
    const [filter, setFilter] = useState<RecipeLibraryFilter>('all')
    const [, startToggling] = useTransition()

    const filteredRecipes = useMemo(
        () => recipes
            .filter((recipe) => {
                if (filter === 'cooked') return recipe.history.length > 0
                if (filter === 'favorites') return recipe.isFavorite
                return true
            })
            .filter((recipe) => recipe.title.includes(query.trim())),
        [recipes, filter, query]
    )

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

    return {
        query,
        setQuery,
        filter,
        setFilter,
        filteredRecipes,
        toggleFavorite
    }
}
