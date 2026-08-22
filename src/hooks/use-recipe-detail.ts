'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'sonner'

import type { Recipe } from '@/types/recipe'

import { routes } from '@/constants/routes'
import { recipesTexts } from '@/constants/texts/recipes'

import { updateRecipe } from '@/actions/recipes/update-recipe'

export const useRecipeDetail = (initialRecipe: Recipe) => {
    const router = useRouter()
    const [recipe, setRecipe] = useState(initialRecipe)

    const applyOptimisticUpdate = async <K extends keyof Recipe>(
        key: K,
        value: Recipe[K],
        errorText: string
    ) => {
        const previousValue = recipe[key]
        setRecipe((current) => ({ ...current, [key]: value }))
        try {
            await updateRecipe(recipe._id, { [key]: value })
        } catch (error) {
            console.error(error)
            setRecipe((current) => ({ ...current, [key]: previousValue }))
            toast.error(errorText)
        }
    }

    const toggleFavorite = () => applyOptimisticUpdate(
        'isFavorite',
        !recipe.isFavorite,
        recipesTexts.detail.favoriteUpdateError
    )

    const updateTags = (tags: string[]) => applyOptimisticUpdate(
        'tags',
        tags,
        recipesTexts.detail.tagsUpdateError
    )

    const updateImageUrl = (imageUrl: string) => applyOptimisticUpdate(
        'imageUrl',
        imageUrl || undefined,
        recipesTexts.result.saveError
    )

    const startCooking = () => {
        router.push(routes.recipeCook(recipe._id))
    }

    return {
        recipe,
        toggleFavorite,
        updateTags,
        updateImageUrl,
        startCooking
    }
}
