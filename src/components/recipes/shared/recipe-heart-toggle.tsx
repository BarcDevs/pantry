import { HeartIcon } from 'lucide-react'

import type { ClassName } from '@/types/react'

import { Button } from '@/components/shared/buttons/Button'

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
    <Button
        variant={'ghost'}
        aria-label={isFavorite
            ? recipesTexts.result.favoriteOn
            : recipesTexts.result.favoriteOff}
        onClick={(e) => {
            e.preventDefault()
            onToggle()
        }}
        className={cn(
            'flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full p-0',
            className
        )}
    >
        <HeartIcon
            size={17}
            className={isFavorite
                ? 'fill-status-red-fg stroke-status-red-fg'
                : 'fill-none stroke-ink-3'}
        />
    </Button>
)
