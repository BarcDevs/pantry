'use client'

import type { Recipe } from '@/types/recipe'

import { CookingModeHeader } from '@/components/recipes/cook/cooking-mode-header'
import { CookingProgressBar } from '@/components/recipes/cook/cooking-progress-bar'
import { CookingStepContent } from '@/components/recipes/cook/cooking-step-content'
import { CookingStepNav } from '@/components/recipes/cook/cooking-step-nav'

import { useCookingMode } from '@/hooks/use-cooking-mode'

type CookingModeViewProps = {
    recipe: Recipe
}

export const CookingModeView = ({ recipe }: CookingModeViewProps) => {
    const cookingMode = useCookingMode(
        recipe._id,
        recipe.steps.length
    )

    const step = recipe.steps[cookingMode.stepIndex]

    return (
        <div className={'flex min-h-dvh flex-col bg-ink text-surface'}>
            <div className={'mx-auto flex w-full max-w-(--breakpoint-md) flex-1 flex-col px-4 py-6'}>
                <CookingModeHeader
                    title={recipe.title}
                    stepNumber={cookingMode.stepIndex + 1}
                    totalSteps={recipe.steps.length}
                    onDoneCooking={cookingMode.doneCooking}
                />
                <CookingProgressBar
                    stepIndex={cookingMode.stepIndex}
                    stepCount={recipe.steps.length}
                />
                <CookingStepContent step={step}/>
                <CookingStepNav
                    stepIndex={cookingMode.stepIndex}
                    isLastStep={cookingMode.isLastStep}
                    onPrev={cookingMode.goPrev}
                    onNext={cookingMode.goNext}
                />
            </div>
        </div>
    )
}
