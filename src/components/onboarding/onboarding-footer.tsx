import { PrimaryButton } from '@/components/shared/buttons/PrimaryButton'
import { SecondaryButton } from '@/components/shared/buttons/SecondaryButton'

import { onboardingTexts } from '@/constants/texts/onboarding'

type OnboardingFooterProps = {
    isLastStep: boolean
    showBack: boolean
    disabled?: boolean
    onBack: () => void
    onSkip: () => void
    onNext: () => void
}

export const OnboardingFooter = ({
    isLastStep,
    showBack,
    disabled = false,
    onBack,
    onSkip,
    onNext
}: OnboardingFooterProps) => (
    <div className={'mx-auto flex w-full max-w-140 items-center gap-3 px-6 py-7'}>
        {showBack && (
            <SecondaryButton
                disabled={disabled}
                onClick={onBack}
            >
                {onboardingTexts.back}
            </SecondaryButton>
        )}
        <SecondaryButton
            disabled={disabled}
            onClick={onSkip}
        >
            {onboardingTexts.skip}
        </SecondaryButton>
        <PrimaryButton
            disabled={disabled}
            onClick={onNext}
            className={'flex-1'}
        >
            {isLastStep ? onboardingTexts.finish : onboardingTexts.next}
        </PrimaryButton>
    </div>
)
