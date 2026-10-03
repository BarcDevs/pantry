'use client'

import { useState } from 'react'

import { PrimaryButton } from '@/components/shared/buttons/PrimaryButton'
import { Input } from '@/components/shared/Input'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeTitleEditorProps = {
    title: string
    onChange: (title: string) => void
}

export const RecipeTitleEditor = ({
    title,
    onChange
}: RecipeTitleEditorProps) => {
    const [draft, setDraft] = useState(title)
    const texts = recipesTexts.detail
    const trimmed = draft.trim()
    const isInvalid = trimmed.length === 0
    const apply = () => {
        if (isInvalid || trimmed === title) return
        onChange(trimmed)
    }

    return (
        <div className={'mb-5 rounded-lg border border-border bg-surface p-4'}>
            <div className={'mb-1 font-display text-heading font-weight-heading text-ink'}>
                {texts.titleLabel}
            </div>
            <div className={'flex flex-wrap gap-2.25'}>
                <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onEnter={isInvalid ? undefined : apply}
                    className={'min-w-50 flex-1'}
                />
                <PrimaryButton
                    disabled={isInvalid || trimmed === title}
                    onClick={apply}
                >
                    {texts.titleApply}
                </PrimaryButton>
            </div>
        </div>
    )
}
