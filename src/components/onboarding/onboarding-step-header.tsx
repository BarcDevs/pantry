type OnboardingStepHeaderProps = {
    title: string
    subtitle: string
}

export const OnboardingStepHeader = ({
    title,
    subtitle
}: OnboardingStepHeaderProps) => (
    <>
        <h2 className={'font-display text-title font-weight-title text-ink'}>
            {title}
        </h2>
        <p className={'mb-4 text-body text-ink-3'}>
            {subtitle}
        </p>
    </>
)
