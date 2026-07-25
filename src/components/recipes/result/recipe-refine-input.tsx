'use client'

import { Button } from '@/components/shared/Button'
import { Input } from '@/components/ui/input'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeRefineInputProps = {
    value: string
    onChange: (value: string) => void
    onSubmit: () => void
    isRefining: boolean
}

export const RecipeRefineInput = ({
    value,
    onChange,
    onSubmit,
    isRefining
}: RecipeRefineInputProps) => {
    const texts = recipesTexts.result

    return (
        <div className={'mt-6 rounded-lg border border-border bg-surface p-4'}>
            <p className={'mb-2.5 font-display text-heading font-weight-heading text-ink'}>
                {texts.refineLabel}
            </p>
            <div className={'flex flex-wrap gap-2.25'}>
                <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={texts.refinePlaceholder}
                    className={'min-w-50 flex-1'}
                />
                <Button
                    onClick={onSubmit}
                    disabled={isRefining || !value.trim()}
                >
                    {isRefining ? texts.refining : texts.refineSubmit}
                </Button>
            </div>
        </div>
    )
}
