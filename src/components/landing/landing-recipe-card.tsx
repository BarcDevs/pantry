type LandingRecipeCardProps = {
    emoji: string
    title: string
    meta: string
    matched: boolean
}

export const LandingRecipeCard = ({
    emoji,
    title,
    meta,
    matched
}: LandingRecipeCardProps) => (
    <div className={'overflow-hidden rounded-[20px] border border-border-2 bg-surface shadow-[0_3px_12px_-10px_rgba(0,0,0,0.2)]'}>
        <div className={'relative flex h-32.5 items-center justify-center bg-[image:var(--gradient-brand)] text-[54px]'}>
            {matched && (
                <span className={'absolute end-2.75 top-2.75 rounded-full bg-surface/90 px-2.5 py-1 text-caption font-bold text-green'}>
                    תואם 100%
                </span>
            )}
            {emoji}
        </div>
        <div className={'p-4'}>
            <div className={'text-body font-bold text-ink'}>
                {title}
            </div>
            <div className={'mt-1 text-caption text-ink-3'}>
                {meta}
            </div>
        </div>
    </div>
)
