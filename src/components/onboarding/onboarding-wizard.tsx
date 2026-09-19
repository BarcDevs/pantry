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
            <OnboardingHeader onSkipAll={onboarding.submission.skipAll}/>
            <OnboardingProgress
                step={onboarding.step.index}
                stepCount={ONBOARDING_STEP_COUNT}
                stepLabel={onboardingTexts.stepLabels[onboarding.step.index]}
            />
            <div className={'mx-auto flex w-full max-w-140 flex-1 flex-col justify-center gap-6 px-6 py-8'}>
                {onboarding.step.index === 0 && (
                    <StepCookingLevel
                        value={onboarding.values.cookingLevel}
                        onChange={onboarding.setters.cookingLevel}
                    />
                )}
                {onboarding.step.index === 1 && (
                    <StepDietaryPreferences
                        value={onboarding.values.dietaryPreferences}
                        onChange={onboarding.setters.dietaryPreferences}
                    />
                )}
                {onboarding.step.index === 2 && (
                    <StepHouseholdSize
                        value={onboarding.values.householdSize}
                        onChange={onboarding.setters.householdSize}
                    />
                )}
            </div>
            <OnboardingFooter
                isLastStep={onboarding.step.isLast}
                showBack={onboarding.step.index > 0}
                disabled={onboarding.submission.isSubmitting}
                onBack={onboarding.step.goBack}
                onSkip={onboarding.step.advance}
                onNext={onboarding.step.advance}
            />
        </div>
    )
}
