import Link from 'next/link'

import { HeartIcon, StarIcon } from 'lucide-react'

import type { Recipe } from '@/types/recipe'

import { Button } from '@/components/shared/Button'

import { routes } from '@/constants/routes'
import { recipesTexts } from '@/constants/texts/recipes'

type RecipeCardProps = {
    recipe: Recipe
    onToggleFavorite: () => void
}

export const RecipeCard = ({
    recipe,
    onToggleFavorite
}: RecipeCardProps) => (
    <Link
        href={routes.recipeDetail(recipe._id)}
        className={'block overflow-hidden rounded-lg border border-border bg-surface text-start shadow-sm'}
    >
        <div
            className={'relative h-30 bg-[image:var(--gradient-brand)] bg-cover bg-center'}
            style={recipe.imageUrl ? { backgroundImage: `url(${recipe.imageUrl})` } : undefined}
        >
            {!recipe.imageUrl && (
                <div className={'absolute inset-0 flex items-center justify-center text-5xl'}>
                    {recipe.emoji ?? '🍽️'}
                </div>
            )}
            <div className={'absolute inset-x-0 top-0 flex justify-between p-2.5'}>
                <span className={'rounded-full bg-surface/90 px-2.5 py-1 text-caption font-bold text-ink'}>
                    {`⏱ ${recipe.maxTime} דק׳`}
                </span>
                <Button
                    variant={'ghost'}
                    aria-label={
                        recipe.isFavorite
                            ? recipesTexts.result.favoriteOn
                            : recipesTexts.result.favoriteOff
                    }
                    onClick={(e) => {
                        e.preventDefault()
                        onToggleFavorite()
                    }}
                    className={'flex size-8 cursor-pointer items-center justify-center rounded-full bg-surface/90 p-0'}
                >
                    <HeartIcon
                        size={17}
                        fill={recipe.isFavorite ? '#e0533d' : 'none'}
                        stroke={recipe.isFavorite ? '#e0533d' : '#8a8578'}
                    />
                </Button>
            </div>
        </div>
        <div className={'p-3.5'}>
            <div className={'flex items-center justify-between gap-2'}>
                <span className={'text-body font-bold text-ink'}>
                    {recipe.title}
                </span>
                {recipe.rating !== null && (
                    <span className={'flex shrink-0 items-center gap-0.75 text-caption font-bold text-status-amber-fg'}>
                        <StarIcon
                            size={13}
                            fill={'#f2b705'}
                            stroke={'#f2b705'}
                        />
                        {recipe.rating.toFixed(1)}
                    </span>
                )}
            </div>
            <div className={'mt-0.75 text-caption text-ink-3'}>
                {`${recipe.ingredients.length} מצרכים · ${recipe.mealCount} מנות`}
            </div>
        </div>
    </Link>
)
