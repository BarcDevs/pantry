type OnboardingProgressProps = {
    step: number
    stepCount: number
    stepLabel: string
}

export const OnboardingProgress = ({
    step,
    stepCount,
    stepLabel
}: OnboardingProgressProps) => (
    <div className={'mx-auto w-full max-w-140 px-6'}>
        <div className={'mb-2 flex items-center justify-between'}>
            <span className={'text-label font-weight-label text-green'}>
                {`שלב ${step + 1} מתוך ${stepCount}`}
            </span>
            <span className={'text-label text-ink-4'}>
                {stepLabel}
            </span>
        </div>
        <div className={'h-1.75 overflow-hidden rounded-full bg-border-3'}>
            <div
                className={'h-full rounded-full bg-green transition-all duration-300'}
                style={{ width: `${((step + 1) / stepCount) * 100}%` }}
            />
        </div>
    </div>
)
