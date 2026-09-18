import Link from 'next/link'

import { PencilIcon } from 'lucide-react'

import { RecipeHeartToggle } from '@/components/recipes/shared/recipe-heart-toggle'
import { StarRating } from '@/components/shared/StarRating'

import type { CookingHistoryRow } from '@/hooks/use-cooking-history'

import { formatCookedAt } from '@/lib/recipes/format-cooked-at'

import { routes } from '@/constants/routes'

type CookingHistoryRowProps = {
    row: CookingHistoryRow
    onRate: (value: number) => void
    onToggleFavorite: () => void
}

export const CookingHistoryRowItem = ({
    row,
    onRate,
    onToggleFavorite
}: CookingHistoryRowProps) => (
    <Link
        href={routes.recipeDetail(row.recipeId)}
        className={'flex items-center gap-3.5 rounded-lg border border-border-2 bg-surface p-3.5 shadow-sm'}
    >
        <div className={'flex size-13 shrink-0 items-center justify-center rounded-md bg-canvas text-2xl'}>
            {row.emoji ?? '🍽️'}
        </div>
        <div className={'min-w-0 flex-1'}>
            <div className={'flex items-center justify-between gap-2'}>
                <div className={'text-heading font-bold text-ink'}>
                    {row.name}
                </div>
                <RecipeHeartToggle
                    isFavorite={row.isFavorite}
                    onToggle={onToggleFavorite}
                />
            </div>
            <div className={'mt-1.75 flex flex-wrap items-center gap-2.5'}>
                <div className={'flex items-center gap-0.5 rounded-full border border-border-2 bg-canvas px-2.25 py-0.75'}>
                    <StarRating
                        rating={row.rating}
                        size={17}
                        onRate={onRate}
                        className={'items-center gap-0.5'}
                        buttonClassName={'p-0.5'}
                    />
                    <PencilIcon
                        aria-hidden={'true'}
                        size={13}
                        className={'mr-1 text-ink-3'}
                    />
                </div>
                <span className={'text-caption text-ink-3'}>
                    {formatCookedAt(row.cookedAt)}
                </span>
            </div>
        </div>
    </Link>
)
