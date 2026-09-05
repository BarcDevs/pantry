'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'sonner'

import type { Recipe } from '@/types/recipe'

import { routes } from '@/constants/routes'
import { recipesTexts } from '@/constants/texts/recipes'

import { deleteRecipe } from '@/actions/recipes/delete-recipe'
import { updateRecipe } from '@/actions/recipes/update-recipe'

export const useRecipeDetail = (initialRecipe: Recipe) => {
    const router = useRouter()
    const [recipe, setRecipe] = useState(initialRecipe)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

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

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await deleteRecipe(recipe._id)
            toast.success(recipesTexts.detail.deleteSuccess)
            router.push(routes.recipes)
        } catch (error) {
            console.error(error)
            toast.error(recipesTexts.detail.deleteError)
            setIsDeleting(false)
        }
    }

    return {
        recipe,
        toggleFavorite,
        updateTags,
        updateImageUrl,
        startCooking,
        confirmDelete,
        setConfirmDelete,
        isDeleting,
        handleDelete
    }
}
