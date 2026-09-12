import { SearchIcon } from 'lucide-react'

import type { SetState } from '@/types/react'

import { Input } from '@/components/shared/Input'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeSearchInputProps = {
    value: string
    onChange: SetState<string>
}

export const RecipeSearchInput = ({
    value,
    onChange
}: RecipeSearchInputProps) => (
    <div className={'mb-3.5 flex items-center gap-2 rounded-md border border-border bg-surface px-3.5'}>
        <SearchIcon
            size={18}
            className={'text-ink-3'}
        />
        <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={recipesTexts.library.search}
            className={'h-auto border-none bg-transparent py-3.5 text-body shadow-none outline-none focus-visible:ring-0'}
        />
    </div>
)
