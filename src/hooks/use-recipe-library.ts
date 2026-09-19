import {
    useMemo,
    useState,
    useTransition
} from 'react'

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
    recipe.ingredients.some((ingredient) => normalizeName(ingredient.label).includes(query))
)

type LibraryValues = {
    query: string
    filter: RecipeLibraryFilter
    sort: RecipeSortOption
}

export const useRecipeLibrary = (initialRecipes: Recipe[]) => {
    const [recipes, setRecipes] = useState(initialRecipes)
    const [values, setValues] = useState<LibraryValues>({
        query: '',
        filter: 'all',
        sort: 'recent'
    })
    const [, startToggling] = useTransition()
    const [isSelecting, setIsSelecting] = useState(false)
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    const setField = <Key extends keyof LibraryValues>(
        key: Key,
        value: LibraryValues[Key]
    ) => setValues((current) => ({
        ...current,
        [key]: value
    }))

    const filteredRecipes = useMemo(() => {
        const trimmedQuery = normalizeName(values.query)
        const tabFiltered = recipes.filter((recipe) => {
            if (values.filter === 'can-cook') {
                return recipe.ingredients
                    .filter((ingredient) => !ingredient.optional)
                    .every((ingredient) => ingredient.inPantry)
            }
            if (values.filter === 'favorites') return recipe.isFavorite
            return true
        })

        if (!trimmedQuery) return [...tabFiltered].sort(sortComparators[values.sort])

        const byTitle = tabFiltered
            .filter((recipe) => titleMatches(recipe, trimmedQuery))
            .sort(sortComparators[values.sort])
        const byIngredientOnly = tabFiltered
            .filter((recipe) => !titleMatches(recipe, trimmedQuery) && ingredientMatches(recipe, trimmedQuery))
            .sort(sortComparators[values.sort])

        return [...byTitle, ...byIngredientOnly]
    }, [recipes, values])

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

    const toggleSelectMode = () => {
        setIsSelecting((current) => !current)
        setSelectedIds([])
    }

    const toggleSelected = (recipeId: string) => {
        setSelectedIds((current) => (
            current.includes(recipeId)
                ? current.filter((id) => id !== recipeId)
                : [...current, recipeId]
        ))
    }

    const deleteSelected = async () => {
        try {
            await Promise.all(selectedIds.map((id) => deleteRecipeAction(id)))
            setRecipes((current) => current.filter((item) => !selectedIds.includes(item._id)))
            setIsSelecting(false)
            setSelectedIds([])
        } catch (error) {
            console.error(error)
            toast.error(recipesTexts.library.bulkDeleteError)
            throw error
        }
    }

    return {
        values,
        setField,
        recipes: {
            filtered: filteredRecipes,
            toggleFavorite,
            remove: deleteRecipe
        },
        selection: {
            isSelecting,
            selectedIds,
            toggleMode: toggleSelectMode,
            toggle: toggleSelected,
            deleteSelected
        }
    }
}
