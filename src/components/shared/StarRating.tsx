import { StarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

import { STAR_VALUES } from '@/constants/rating'
import { recipesTexts } from '@/constants/texts/recipes'

type StarRatingProps = {
    rating: number | null
    size: number
    onRate?: (value: number) => void
    onHover?: (value: number) => void
    onHoverEnd?: () => void
    className?: string
    buttonClassName?: string
}

export const StarRating = ({
    rating,
    size,
    onRate,
    onHover,
    onHoverEnd,
    className,
    buttonClassName
}: StarRatingProps) => {
    const texts = recipesTexts.rate

    return (
        <div className={cn('flex', className)}>
            {STAR_VALUES.map((value) => {
                const star = (
                    <StarIcon
                        size={size}
                        className={cn(
                            rating !== null && value <= rating
                                ? 'fill-status-amber-fg text-status-amber-fg'
                                : 'fill-none text-border'
                        )}
                    />
                )

                if (!onRate) {
                    return (
                        <span key={value}>
                            {star}
                        </span>
                    )
                }

                return (
                    <button
                        key={value}
                        type={'button'}
                        aria-label={rating === value
                            ? texts.starLabelSelected(value)
                            : texts.starLabel(value)}
                        onClick={(e) => {
                            e.preventDefault()
                            onRate(value)
                        }}
                        onMouseEnter={() => onHover?.(value)}
                        onMouseLeave={onHoverEnd}
                        className={cn('cursor-pointer', buttonClassName)}
                    >
                        {star}
                    </button>
                )
            })}
        </div>
    )
}
