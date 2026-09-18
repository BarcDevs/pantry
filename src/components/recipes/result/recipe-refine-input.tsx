'use client'

import { PrimaryButton } from '@/components/shared/buttons/PrimaryButton'
import { Input } from '@/components/shared/Input'

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
                onEnter={isRefining || !value.trim() ? undefined : onSubmit}
                placeholder={placeholder}
                className={'min-w-50 flex-1'}
            />
            <PrimaryButton
                onClick={onSubmit}
                disabled={isRefining || !value.trim()}
            >
                {isRefining ? loadingLabel : submitLabel}
            </PrimaryButton>
        </div>
    </div>
)
