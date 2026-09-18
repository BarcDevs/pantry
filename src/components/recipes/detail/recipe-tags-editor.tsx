'use client'

import { useState } from 'react'

import { XIcon } from 'lucide-react'

import { IconButton } from '@/components/shared/buttons/IconButton'
import { SecondaryButton } from '@/components/shared/buttons/SecondaryButton'
import { Input } from '@/components/shared/Input'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeTagsEditorProps = {
    tags: string[]
    onChange: (tags: string[]) => void
}

export const RecipeTagsEditor = ({
    tags,
    onChange
}: RecipeTagsEditorProps) => {
    const [draft, setDraft] = useState('')
    const texts = recipesTexts.detail

    const addTag = () => {
        const trimmed = draft.trim()
        if (!trimmed || tags.includes(trimmed)) return
        onChange([...tags, trimmed])
        setDraft('')
    }

    const removeTag = (tag: string) => {
        onChange(tags.filter((item) => item !== tag))
    }

    return (
        <div className={'mt-4.5 rounded-lg border border-border bg-surface p-4'}>
            <div className={'mb-3 font-bold text-body text-ink'}>
                {texts.tagsLabel}
            </div>
            <div className={'mb-3 flex flex-wrap gap-2'}>
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className={'flex items-center gap-1.5 rounded-full bg-border-3 px-3 py-1.5 text-caption font-semibold text-ink-2'}
                    >
                        {tag}
                        <IconButton
                            aria-label={tag}
                            className={'size-auto p-0.5 text-ink-3'}
                            onClick={() => removeTag(tag)}
                        >
                            <XIcon size={13}/>
                        </IconButton>
                    </span>
                ))}
            </div>
            <div className={'flex gap-2'}>
                <Input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault()
                            addTag()
                        }
                    }}
                    placeholder={texts.tagsPlaceholder}
                />
                <SecondaryButton onClick={addTag}>
                    {'+'}
                </SecondaryButton>
            </div>
        </div>
    )
}
