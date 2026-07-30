import { recipesTexts } from '@/constants/texts/recipes'

type RateHeaderProps = {
    emoji?: string
    title: string
}

export const RateHeader = ({
    emoji,
    title
}: RateHeaderProps) => (
    <div className={'mb-6 text-center'}>
        <div className={'mx-auto mb-4 flex size-20 items-center justify-center rounded-2xl bg-[image:var(--gradient-brand)] text-title shadow-lg'}>
            {emoji ?? '🍽️'}
        </div>
        <div className={'font-display text-heading font-extrabold'}>
            {recipesTexts.rate.title}
        </div>
        <div className={'mt-1.5 text-body text-ink-3'}>
            {`${recipesTexts.rate.descriptionPrefix} `}
            <strong className={'text-ink'}>
                {title}
            </strong>
            {` ${recipesTexts.rate.descriptionSuffix}`}
        </div>
    </div>
)
