'use client'

import {
    useState,
    useTransition
} from 'react'

import { toast } from 'sonner'

import { OutlinedActionButton } from '@/components/shared/buttons/OutlinedActionButton'
import { PrimaryButton } from '@/components/shared/buttons/PrimaryButton'
import { TextButton } from '@/components/shared/buttons/TextButton'
import { UrlInput } from '@/components/shared/UrlInput'

import {
    isUrlInputInvalid,
    parseUrlInput
} from '@/lib/network/parse-url-input'

import { recipesTexts } from '@/constants/texts/recipes'

import { searchRecipeImage } from '@/actions/recipes/search-recipe-image'

type RecipeImageUrlFieldProps = {
    imageUrl: string | undefined
    onChange: (imageUrl: string) => void
    title: string
    ingredientLabels: string[]
}

export const RecipeImageUrlField = ({
    imageUrl,
    onChange,
    title,
    ingredientLabels
}: RecipeImageUrlFieldProps) => {
    const [draft, setDraft] = useState(imageUrl ?? '')
    const [isSearching, startSearching] = useTransition()
    const texts = recipesTexts.result
    const isInvalid = isUrlInputInvalid(draft)
    const applyImage = () => onChange(parseUrlInput(draft) ?? '')

    const searchForImage = () => {
        startSearching(async () => {
            try {
                const { imageUrl: found } = await searchRecipeImage({
                    title,
                    ingredients: ingredientLabels
                })
                if (!found) {
                    toast.error(texts.searchImageNotFound)
                    return
                }
                setDraft(found)
                onChange(found)
            } catch (error) {
                console.error(error)
                toast.error(texts.searchImageError)
            }
        })
    }

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
            {!imageUrl && (
                <>
                    <p className={'mb-3 text-label text-ink-3'}>
                        {texts.imageFieldDescription}
                    </p>
                    <OutlinedActionButton
                        disabled={isSearching}
                        onClick={searchForImage}
                        className={'mb-3'}
                    >
                        {isSearching ? texts.searchingImage : texts.searchImage}
                    </OutlinedActionButton>
                </>
            )}
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
                    className={'mt-2.75 px-2 py-1'}
                >
                    {texts.removeImage}
                </TextButton>
            )}
        </div>
    )
}
