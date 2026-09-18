import type { ClassName } from '@/types/react'
import type { RecipeDoc } from '@/types/recipe'

import { SecondaryButton } from '@/components/shared/buttons/SecondaryButton'

import { cn } from '@/lib/utils'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeFavoriteButtonProps = {
    recipe: RecipeDoc
    onToggle: () => void
    className?: ClassName
}

export const RecipeFavoriteButton = ({
    recipe,
    onToggle,
    className
}: RecipeFavoriteButtonProps) => {
    const texts = recipesTexts.result

    return (
        <SecondaryButton
            onClick={onToggle}
            className={cn(
                className,
                recipe.isFavorite && 'border-green bg-green/10 text-ink-green'
            )}
        >
            {recipe.isFavorite ? texts.favoriteOn : texts.favoriteOff}
        </SecondaryButton>
    )
}
