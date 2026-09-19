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
    const onboarding = useOnboardingWizard()

    return (
        <div className={'flex min-h-screen flex-col bg-canvas'}>
            <OnboardingHeader onSkipAll={onboarding.skipAll}/>
            <OnboardingProgress
                step={onboarding.step}
                stepCount={ONBOARDING_STEP_COUNT}
                stepLabel={onboardingTexts.stepLabels[onboarding.step]}
            />
            <div className={'mx-auto flex w-full max-w-140 flex-1 flex-col justify-center gap-6 px-6 py-8'}>
                {onboarding.step === 0 && (
                    <StepCookingLevel
                        value={onboarding.cookingLevel}
                        onChange={onboarding.setCookingLevel}
                    />
                )}
                {onboarding.step === 1 && (
                    <StepDietaryPreferences
                        value={onboarding.dietaryPreferences}
                        onChange={onboarding.setDietaryPreferences}
                    />
                )}
                {onboarding.step === 2 && (
                    <StepHouseholdSize
                        value={onboarding.householdSize}
                        onChange={onboarding.setHouseholdSize}
                    />
                )}
            </div>
            <OnboardingFooter
                isLastStep={onboarding.isLastStep}
                showBack={onboarding.step > 0}
                disabled={onboarding.isSubmitting}
                onBack={onboarding.goBack}
                onSkip={onboarding.advance}
                onNext={onboarding.advance}
            />
        </div>
    )
}
