import { HeartIcon } from 'lucide-react'

import type { ClassName } from '@/types/react'

import { IconButton } from '@/components/shared/buttons/IconButton'

import { cn } from '@/lib/utils'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeHeartToggleProps = {
    isFavorite: boolean
    onToggle: () => void
    className?: ClassName
}

export const RecipeHeartToggle = ({
    isFavorite,
    onToggle,
    className
}: RecipeHeartToggleProps) => (
    <IconButton
        aria-label={isFavorite
            ? recipesTexts.result.favoriteOn
            : recipesTexts.result.favoriteOff}
        onClick={(e) => {
            e.preventDefault()
            onToggle()
        }}
        className={cn('size-8', className)}
    >
        <HeartIcon
            size={17}
            className={isFavorite
                ? 'fill-status-red-fg stroke-status-red-fg'
                : 'fill-none stroke-ink-3'}
        />
    </IconButton>
)
