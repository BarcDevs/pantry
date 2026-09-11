'use client'

import { Button } from '@/components/shared/Button'
import { Input } from '@/components/ui/input'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeRefineInputProps = {
    value: string
    onChange: (value: string) => void
    onSubmit: () => void
    isRefining: boolean
    label?: string
    placeholder?: string
    submitLabel?: string
    loadingLabel?: string
}

export const RecipeRefineInput = ({
    value,
    onChange,
    onSubmit,
    isRefining,
    label = recipesTexts.result.refineLabel,
    placeholder = recipesTexts.result.refinePlaceholder,
    submitLabel = recipesTexts.result.refineSubmit,
    loadingLabel = recipesTexts.result.refining
}: RecipeRefineInputProps) => (
    <div className={'mt-6 rounded-lg border border-border bg-surface p-4'}>
        <p className={'mb-2.5 font-display text-heading font-weight-heading text-ink'}>
            {label}
        </p>
        <div className={'flex flex-wrap gap-2.25'}>
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={'min-w-50 flex-1'}
            />
            <Button
                onClick={onSubmit}
                disabled={isRefining || !value.trim()}
            >
                {isRefining ? loadingLabel : submitLabel}
            </Button>
        </div>
    </div>
)
