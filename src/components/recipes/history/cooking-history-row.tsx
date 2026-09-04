import Link from 'next/link'

import {
    PencilIcon,
    StarIcon
} from 'lucide-react'

import type { CookingHistoryRow }
    from '@/hooks/use-cooking-history'

import { formatCookedAt }
    from '@/lib/recipes/format-cooked-at'
import { cn } from '@/lib/utils'

import { routes } from '@/constants/routes'

const STAR_VALUES = [1, 2, 3, 4, 5]

type CookingHistoryRowProps = {
    row: CookingHistoryRow
    onRate: (value: number) => void
}

export const CookingHistoryRowItem = ({
    row,
    onRate
}: CookingHistoryRowProps) => (
    <Link
        href={routes.recipeDetail(row.recipeId)}
        className={'flex items-center gap-3.5 rounded-lg border border-border-2 bg-surface p-3.5 shadow-sm'}
    >
        <div className={'flex size-13 shrink-0 items-center justify-center rounded-md bg-canvas text-2xl'}>
            {row.emoji ?? '🍽️'}
        </div>
        <div className={'min-w-0 flex-1'}>
            <div className={'text-heading font-bold text-ink'}>
                {row.name}
            </div>
            <div className={'mt-1.75 flex flex-wrap items-center gap-2.5'}>
                <div className={'flex items-center gap-0.5 rounded-full border border-border-2 bg-canvas px-2.25 py-0.75'}>
                    {STAR_VALUES.map((value) => (
                        <button
                            key={value}
                            type={'button'}
                            aria-label={row.rating === value
                                ? `${value} כוכבים, נבחר`
                                : `${value} כוכבים`}
                            onClick={(e) => {
                                e.preventDefault()
                                onRate(value)
                            }}
                            className={'cursor-pointer p-0.5'}
                        >
                            <StarIcon
                                size={17}
                                className={cn(
                                    row.rating !== null && value <= row.rating
                                        ? 'fill-status-amber-fg text-status-amber-fg'
                                        : 'fill-none text-border'
                                )}
                            />
                        </button>
                    ))}
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
