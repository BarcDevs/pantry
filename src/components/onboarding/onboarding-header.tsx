import { Button } from '@/components/shared/buttons/Button'

import { commonTexts } from '@/constants/texts/common'
import { onboardingTexts } from '@/constants/texts/onboarding'

type OnboardingHeaderProps = {
    onSkipAll: () => void
}

export const OnboardingHeader = ({
    onSkipAll
}: OnboardingHeaderProps) => (
    <div className={'mx-auto flex w-full max-w-140 items-center justify-between px-6 py-5'}>
        <span className={'font-display text-heading font-weight-heading text-ink'}>
            {commonTexts.appName}
        </span>
        <Button
            variant={'ghost'}
            onClick={onSkipAll}
            className={'h-auto p-0 text-label font-weight-label text-ink-3 shadow-none'}
        >
            {onboardingTexts.skipAll}
        </Button>
    </div>
)
