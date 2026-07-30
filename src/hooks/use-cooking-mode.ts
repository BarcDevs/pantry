import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { routes } from '@/constants/routes'

export const useCookingMode = (
    recipeId: string,
    stepCount: number
) => {
    const router = useRouter()
    const [stepIndex, setStepIndex] = useState(0)

    const isLastStep = stepIndex === stepCount - 1

    const goPrev = () => setStepIndex(
        (current) => Math.max(0, current - 1)
    )

    const goNext = () => {
        if (isLastStep) {
            router.push(routes.recipeDeduct(recipeId))
            return
        }
        setStepIndex((current) => (
            Math.min(stepCount - 1, current + 1)
        ))
    }

    const doneCooking = () => {
        router.push(routes.recipeDeduct(recipeId))
    }

    return {
        stepIndex,
        isLastStep,
        goPrev,
        goNext,
        doneCooking
    }
}
