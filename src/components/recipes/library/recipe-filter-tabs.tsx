import type { SetState } from '@/types/react'
import type { RecipeLibraryFilter } from '@/types/recipe'

import { Button } from '@/components/shared/Button'

import { cn } from '@/lib/utils'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeFilterTabsProps = {
    value: RecipeLibraryFilter
    onChange: SetState<RecipeLibraryFilter>
}

const tabs: Array<{
    key: RecipeLibraryFilter
    label: string
}> = [
    { key: 'all', label: recipesTexts.library.filterAll },
    { key: 'can-cook', label: recipesTexts.library.filterCanCook },
    { key: 'favorites', label: recipesTexts.library.filterFavorites }
]

const chipClassName = (isActive: boolean) => cn(
    'h-auto rounded-full border px-3.5 py-2 text-label font-semibold',
    isActive
        ? 'border-green bg-green text-white'
        : 'border-border bg-surface text-ink-2'
)

export const RecipeFilterTabs = ({
    value,
    onChange
}: RecipeFilterTabsProps) => (
    <div className={'flex flex-wrap gap-2'}>
        {tabs.map((tab) => (
            <Button
                key={tab.key}
                variant={'ghost'}
                onClick={() => onChange(tab.key)}
                className={chipClassName(value === tab.key)}
            >
                {tab.label}
            </Button>
        ))}
    </div>
)
