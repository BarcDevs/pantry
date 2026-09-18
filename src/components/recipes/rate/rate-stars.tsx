import { StarRating } from '@/components/shared/StarRating'

import { recipesTexts } from '@/constants/texts/recipes'

type RateStarsProps = {
    rating: number
    hoverRating: number
    onRate: (value: number) => void
    onHover: (value: number) => void
    onHoverEnd: () => void
}

export const RateStars = ({
    rating,
    hoverRating,
    onRate,
    onHover,
    onHoverEnd
}: RateStarsProps) => {
    const shownRating = hoverRating || rating

    return (
        <div className={'rounded-xl border border-border-3 bg-surface p-6 text-center'}>
            <StarRating
                rating={shownRating}
                size={38}
                onRate={onRate}
                onHover={onHover}
                onHoverEnd={onHoverEnd}
                className={'mb-2.5 justify-center gap-1.5'}
                buttonClassName={'p-0.75'}
            />
            <div className={'text-label font-semibold text-ink-3'}>
                {recipesTexts.rate.ratingLabels[shownRating]}
            </div>
        </div>
    )
}
