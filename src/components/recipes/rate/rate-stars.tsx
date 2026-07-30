import { RateStar } from '@/components/recipes/rate/rate-star'

import { recipesTexts } from '@/constants/texts/recipes'

const STAR_VALUES = [1, 2, 3, 4, 5]

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
            <div className={'mb-2.5 flex justify-center gap-1.5'}>
                {STAR_VALUES.map((value) => (
                    <RateStar
                        key={value}
                        value={value}
                        filled={value <= shownRating}
                        onClick={() => onRate(value)}
                        onHover={() => onHover(value)}
                        onHoverEnd={onHoverEnd}
                    />
                ))}
            </div>
            <div className={'text-label font-semibold text-ink-3'}>
                {recipesTexts.rate.ratingLabels[shownRating]}
            </div>
        </div>
    )
}
