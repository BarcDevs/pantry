'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'sonner'

import type { Difficulty } from '@/types/enums'

import { OnboardingFooter } from '@/components/onboarding/onboarding-footer'
import { StepCookingLevel } from '@/components/onboarding/step-cooking-level'
import { StepDietaryPreferences } from '@/components/onboarding/step-dietary-preferences'
import { StepHouseholdSize } from '@/components/onboarding/step-household-size'

import { routes } from '@/constants/routes'
import { onboardingTexts } from '@/constants/texts/onboarding'

import { updateOnboarding } from '@/actions/users/update-onboarding'

const STEP_COUNT = 3

export const OnboardingWizard = () => {
    const router = useRouter()
    const [step, setStep] = useState(0)
    const [cookingLevel, setCookingLevel] = useState<Difficulty | undefined>()
    const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([])
    const [householdSize, setHouseholdSize] = useState<number | undefined>()

    const isLastStep = step === STEP_COUNT - 1

    const finish = async () => {
        try {
            await updateOnboarding({
                cookingLevel,
                dietaryPreferences,
                householdSize
            })
            router.push(routes.pantry)
        } catch {
            toast.error(onboardingTexts.saveError)
        }
    }

    const advance = () => (isLastStep ? finish() : setStep(step + 1))

    return (
        <div className={'flex min-h-screen flex-col gap-8 p-6'}>
            <h1 className={'font-display text-title font-weight-title'}>
                {onboardingTexts.title}
            </h1>
            <div className={'flex flex-1 flex-col gap-6'}>
                {step === 0 && (
                    <StepCookingLevel
                        value={cookingLevel}
                        onChange={setCookingLevel}
                    />
                )}
                {step === 1 && (
                    <StepDietaryPreferences
                        value={dietaryPreferences}
                        onChange={setDietaryPreferences}
                    />
                )}
                {step === 2 && (
                    <StepHouseholdSize
                        value={householdSize}
                        onChange={setHouseholdSize}
                    />
                )}
            </div>
            <OnboardingFooter
                isLastStep={isLastStep}
                onSkip={advance}
                onNext={advance}
            />
        </div>
    )
}
