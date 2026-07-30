import { useState, useTransition } from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'sonner'

import { routes } from '@/constants/routes'
import { recipesTexts } from '@/constants/texts/recipes'

import { cookRecipe } from '@/actions/recipes/cook-recipe'

export const useRateRecipe = (recipeId: string) => {
    const router = useRouter()
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [isSubmitting, startSubmitting] = useTransition()

    const finishRate = () => {
        startSubmitting(async () => {
            try {
                await cookRecipe(recipeId, rating > 0 ? rating : null)
                router.push(routes.pantry)
            } catch (error) {
                console.error(error)
                toast.error(recipesTexts.rate.rateError)
            }
        })
    }

    return {
        rating,
        setRating,
        hoverRating,
        setHoverRating,
        isSubmitting,
        finishRate
    }
}
