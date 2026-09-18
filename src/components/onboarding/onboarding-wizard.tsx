'use client'

import { OnboardingFooter } from '@/components/onboarding/onboarding-footer'
import { OnboardingHeader } from '@/components/onboarding/onboarding-header'
import { OnboardingProgress } from '@/components/onboarding/onboarding-progress'
import { StepCookingLevel } from '@/components/onboarding/step-cooking-level'
import { StepDietaryPreferences } from '@/components/onboarding/step-dietary-preferences'
import { StepHouseholdSize } from '@/components/onboarding/step-household-size'

import { useOnboardingWizard } from '@/hooks/use-onboarding-wizard'

import { ONBOARDING_STEP_COUNT } from '@/constants/onboarding'
import { onboardingTexts } from '@/constants/texts/onboarding'

export const OnboardingWizard = () => {
    const {
        step,
        isLastStep,
        isSubmitting,
        advance,
        goBack,
        skipAll,
        cookingLevel,
        setCookingLevel,
        dietaryPreferences,
        setDietaryPreferences,
        householdSize,
        setHouseholdSize
    } = useOnboardingWizard()

    return (
        <div className={'flex min-h-screen flex-col bg-canvas'}>
            <OnboardingHeader onSkipAll={skipAll}/>
            <OnboardingProgress
                step={step}
                stepCount={ONBOARDING_STEP_COUNT}
                stepLabel={onboardingTexts.stepLabels[step]}
            />
            <div className={'mx-auto flex w-full max-w-140 flex-1 flex-col justify-center gap-6 px-6 py-8'}>
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
                showBack={step > 0}
                disabled={isSubmitting}
                onBack={goBack}
                onSkip={advance}
                onNext={advance}
            />
        </div>
    )
}
