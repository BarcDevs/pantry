import {
    useState,
    useTransition
} from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'sonner'

import { routes } from '@/constants/routes'
import { recipesTexts } from '@/constants/texts/recipes'

import { cookRecipe } from '@/actions/recipes/cook-recipe'

type RateValues = {
    rating: number
    hoverRating: number
}

export const useRateRecipe = (recipeId: string) => {
    const router = useRouter()
    const [values, setValues] = useState<RateValues>({
        rating: 0,
        hoverRating: 0
    })
    const [isSubmitting, startSubmitting] = useTransition()

    const setField = <Key extends keyof RateValues>(
        key: Key,
        value: RateValues[Key]
    ) => setValues((current) => ({
        ...current,
        [key]: value
    }))

    const finishRate = () => {
        startSubmitting(async () => {
            try {
                await cookRecipe(recipeId, values.rating > 0 ? values.rating : null)
                router.push(routes.pantry)
            } catch (error) {
                console.error(error)
                toast.error(recipesTexts.rate.rateError)
            }
        })
    }

    return {
        values,
        setField,
        submission: {
            isSubmitting,
            finish: finishRate
        }
    }
}
