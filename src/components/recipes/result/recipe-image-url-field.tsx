'use client'

import { useState } from 'react'

import { Button } from '@/components/shared/Button'
import { Input } from '@/components/shared/Input'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeImageUrlFieldProps = {
    imageUrl: string | undefined
    onChange: (imageUrl: string) => void
}

export const RecipeImageUrlField = ({
    imageUrl,
    onChange
}: RecipeImageUrlFieldProps) => {
    const [draft, setDraft] = useState(imageUrl ?? '')
    const texts = recipesTexts.result

    return (
        <div className={'mb-5 rounded-lg border border-border bg-surface p-4'}>
            <div className={'mb-1 flex items-center gap-2'}>
                <span className={'font-display text-heading font-weight-heading text-ink'}>
                    {texts.imageFieldTitle}
                </span>
                <span className={'text-caption text-ink-3'}>
                    {texts.imageFieldOptional}
                </span>
            </div>
            <p className={'mb-3 text-label text-ink-3'}>
                {texts.imageFieldDescription}
            </p>
            <div className={'flex flex-wrap gap-2.25'}>
                <Input
                    dir={'ltr'}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={texts.imageUrlPlaceholder}
                    className={'min-w-50 flex-1'}
                />
                <Button onClick={() => onChange(draft)}>
                    {texts.applyImage}
                </Button>
            </div>
            {imageUrl && (
                <Button
                    variant={'ghost'}
                    onClick={() => {
                        setDraft('')
                        onChange('')
                    }}
                    className={'mt-2.75 text-status-red-fg'}
                >
                    {texts.removeImage}
                </Button>
            )}
        </div>
    )
}
