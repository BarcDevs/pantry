'use client'

import { useState } from 'react'

import { PrimaryButton } from '@/components/shared/buttons/PrimaryButton'
import { TextButton } from '@/components/shared/buttons/TextButton'
import { UrlInput } from '@/components/shared/UrlInput'

import { isUrlInputInvalid, parseUrlInput } from '@/lib/network/parse-url-input'

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
    const isInvalid = isUrlInputInvalid(draft)
    const applyImage = () => onChange(parseUrlInput(draft) ?? '')

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
                <UrlInput
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onEnter={isInvalid ? undefined : applyImage}
                    placeholder={texts.imageUrlPlaceholder}
                    className={'min-w-50 flex-1'}
                />
                <PrimaryButton
                    disabled={isInvalid}
                    onClick={applyImage}
                >
                    {texts.applyImage}
                </PrimaryButton>
            </div>
            {imageUrl && (
                <TextButton
                    tone={'red'}
                    onClick={() => {
                        setDraft('')
                        onChange('')
                    }}
                    className={'mt-2.75'}
                >
                    {texts.removeImage}
                </TextButton>
            )}
        </div>
    )
}
