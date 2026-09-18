import { LinkButton } from '@/components/shared/buttons/LinkButton'

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
        <LinkButton
            onClick={onSkipAll}
            className={'text-label font-weight-label'}
        >
            {onboardingTexts.skipAll}
        </LinkButton>
    </div>
)
