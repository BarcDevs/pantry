import { StarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

type RateStarProps = {
    value: number
    filled: boolean
    onClick: () => void
    onHover: () => void
    onHoverEnd: () => void
}

export const RateStar = ({
    value,
    filled,
    onClick,
    onHover,
    onHoverEnd
}: RateStarProps) => (
    <button
        type={'button'}
        aria-label={`${value} כוכבים`}
        onClick={onClick}
        onMouseEnter={onHover}
        onMouseLeave={onHoverEnd}
        className={'cursor-pointer p-0.75'}
    >
        <StarIcon
            size={38}
            className={cn(
                filled ? 'fill-status-amber-fg text-status-amber-fg' : 'fill-none text-border'
            )}
        />
    </button>
)
