import Link from 'next/link'

import { StarIcon } from 'lucide-react'

import type { Recipe } from '@/types/recipe'

import { RecipeHeartToggle } from '@/components/recipes/shared/recipe-heart-toggle'

import { routes } from '@/constants/routes'

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
        className={'block overflow-hidden rounded-lg border border-border-2 bg-surface text-start shadow-sm'}
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
                <RecipeHeartToggle
                    isFavorite={recipe.isFavorite}
                    onToggle={onToggleFavorite}
                    className={'bg-surface/90'}
                />
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
            {recipe.tags[0] && (
                <span className={'mt-2.5 inline-block rounded-full bg-border-3 px-2.5 py-1 text-caption font-bold text-ink-2'}>
                    {recipe.tags[0]}
                </span>
            )}
        </div>
    </Link>
)
