import { Button } from '@/components/shared/Button'

import { onboardingTexts } from '@/constants/texts/onboarding'

type OnboardingFooterProps = {
    isLastStep: boolean
    onSkip: () => void
    onNext: () => void
}

export const OnboardingFooter = ({
    isLastStep,
    onSkip,
    onNext
}: OnboardingFooterProps) => (
    <div className={'flex items-center justify-between gap-3'}>
        <Button
            variant={'ghost'}
            onClick={onSkip}
        >
            {onboardingTexts.skip}
        </Button>
        <Button onClick={onNext}>
            {isLastStep ? onboardingTexts.finish : onboardingTexts.next}
        </Button>
    </div>
)
