import { onboardingTexts } from '@/constants/texts/onboarding'

const OnboardingPage = () => (
    <div className={'flex min-h-screen flex-col items-center justify-center gap-4'}>
        <h1 className={'font-display text-title font-weight-title'}>
            {onboardingTexts.title}
        </h1>
        <p className={'text-body text-ink-3'}>
            {onboardingTexts.comingSoon}
        </p>
    </div>
)

export default OnboardingPage
