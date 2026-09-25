type FeatureChip = {
    label: string
    tone: 'green' | 'amber' | 'red'
}

type LandingFeatureCardProps = {
    emoji: string
    title: string
    description: string
    chips?: FeatureChip[]
}

const chipToneClass: Record<FeatureChip['tone'], string> = {
    green: 'bg-status-green-bg text-status-green-fg',
    amber: 'bg-status-amber-bg text-status-amber-fg',
    red: 'bg-status-red-bg text-status-red-fg'
}

export const LandingFeatureCard = ({
    emoji,
    title,
    description,
    chips
}: LandingFeatureCardProps) => (
    <div className={'rounded-[20px] border border-border-2 bg-surface p-6.5 shadow-[0_3px_12px_-10px_rgba(0,0,0,0.2)]'}>
        <div className={'mb-4.5 flex size-13.5 items-center justify-center rounded-2xl bg-status-green-bg text-[27px]'}>
            {emoji}
        </div>
        <div className={'mb-2 font-display text-heading font-weight-heading text-ink'}>
            {title}
        </div>
        <div className={'text-body leading-relaxed text-ink-2'}>
            {description}
        </div>
        {chips && (
            <div className={'mt-3.5 flex flex-wrap gap-1.75'}>
                {chips.map((chip) => (
                    <span
                        key={chip.label}
                        className={`rounded-full px-2.5 py-0.75 text-caption font-bold ${chipToneClass[chip.tone]}`}
                    >
                        {chip.label}
                    </span>
                ))}
            </div>
        )}
    </div>
)
