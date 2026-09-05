import { useState } from 'react'

import Link from 'next/link'

import { StarIcon, Trash2Icon } from 'lucide-react'

import type { Recipe } from '@/types/recipe'

import { DeleteRecipeDialog } from '@/components/recipes/shared/delete-recipe-dialog'
import { RecipeHeartToggle } from '@/components/recipes/shared/recipe-heart-toggle'
import { Button } from '@/components/shared/Button'

import { routes } from '@/constants/routes'
import { recipesTexts } from '@/constants/texts/recipes'

type RecipeCardProps = {
    recipe: Recipe
    onToggleFavorite: () => void
    onDelete: () => Promise<void>
}

export const RecipeCard = ({
    recipe,
    onToggleFavorite,
    onDelete
}: RecipeCardProps) => {
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await onDelete()
            setConfirmDelete(false)
        } catch {
            setIsDeleting(false)
        }
    }

    return (
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
                    <div className={'flex gap-1.5'}>
                        <RecipeHeartToggle
                            isFavorite={recipe.isFavorite}
                            onToggle={onToggleFavorite}
                            className={'bg-surface/90'}
                        />
                        <Button
                            variant={'ghost'}
                            aria-label={recipesTexts.detail.deleteButton}
                            onClick={(e) => {
                                e.preventDefault()
                                setConfirmDelete(true)
                            }}
                            className={'flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-surface/90 p-0'}
                        >
                            <Trash2Icon
                                size={17}
                                className={'stroke-status-red-fg'}
                            />
                        </Button>
                    </div>
                </div>
            </div>
            <div className={'mt-2 p-3.5'}>
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
            <DeleteRecipeDialog
                open={confirmDelete}
                onOpenChange={setConfirmDelete}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
            />
        </Link>
    )
}
