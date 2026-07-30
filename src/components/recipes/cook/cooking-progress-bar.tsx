type CookingProgressBarProps = {
    stepIndex: number
    stepCount: number
}

export const CookingProgressBar = ({
    stepIndex,
    stepCount
}: CookingProgressBarProps) => {
    const percent = ((stepIndex + 1) / stepCount) * 100

    return (
        <div className={'mb-9 h-1.5 overflow-hidden rounded-full bg-surface/14'}>
            <div
                className={'h-full rounded-full bg-saffron transition-[width] duration-300'}
                style={{ width: `${percent}%` }}
            />
        </div>
    )
}
