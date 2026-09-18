import { StarRating } from '@/components/shared/StarRating'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeRatingDisplayProps = {
    rating: number | null
    cookCount: number
}

export const RecipeRatingDisplay = ({
    rating,
    cookCount
}: RecipeRatingDisplayProps) => {
    const texts = recipesTexts.detail
    const roundedRating = rating !== null ? Math.round(rating) : 0

    return (
        <div className={'mt-4.5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface p-4'}>
            <div>
                <div className={'font-bold text-body text-ink'}>
                    {texts.ratingTitle}
                </div>
                <div className={'mt-0.5 text-caption text-ink-3'}>
                    {cookCount > 0
                        ? texts.ratingWithHistory(cookCount)
                        : texts.ratingNoHistory}
                </div>
            </div>
            <div className={'flex items-center gap-2.5'}>
                <StarRating
                    rating={roundedRating}
                    size={22}
                    className={'gap-0.5'}
                />
                <span className={'min-w-[2rem] text-center font-display text-heading font-weight-heading text-ink'}>
                    {rating !== null ? rating.toFixed(1) : '-'}
                </span>
            </div>
        </div>
    )
}
