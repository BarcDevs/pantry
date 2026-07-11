import { Button } from '@/components/shared/Button'

import { onboardingTexts } from '@/constants/texts/onboarding'

type OnboardingFooterProps = {
    isLastStep: boolean
    showBack: boolean
    onBack: () => void
    onSkip: () => void
    onNext: () => void
}

export const OnboardingFooter = ({
    isLastStep,
    showBack,
    onBack,
    onSkip,
    onNext
}: OnboardingFooterProps) => (
    <div className={'mx-auto flex w-full max-w-140 items-center gap-3 px-6 py-7'}>
        {showBack && (
            <Button
                variant={'outline'}
                onClick={onBack}
            >
                {onboardingTexts.back}
            </Button>
        )}
        <Button
            variant={'ghost'}
            onClick={onSkip}
        >
            {onboardingTexts.skip}
        </Button>
        <Button
            onClick={onNext}
            className={'flex-1'}
        >
            {isLastStep ? onboardingTexts.finish : onboardingTexts.next}
        </Button>
    </div>
)
