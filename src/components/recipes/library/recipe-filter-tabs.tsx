import type { SetState } from '@/types/react'
import type { RecipeLibraryFilter } from '@/types/recipe'

import { ChipButton } from '@/components/shared/buttons/ChipButton'

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

export const RecipeFilterTabs = ({
    value,
    onChange
}: RecipeFilterTabsProps) => (
    <div className={'flex flex-wrap gap-2'}>
        {tabs.map((tab) => (
            <ChipButton
                key={tab.key}
                isSelected={value === tab.key}
                onClick={() => onChange(tab.key)}
                className={value === tab.key ? 'border-ink bg-ink text-white' : ''}
            >
                {tab.label}
            </ChipButton>
        ))}
    </div>
)
