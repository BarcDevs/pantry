'use client'

import { useState } from 'react'

import { ImportRecipeReview } from '@/components/recipes/import/import-recipe-review'
import { ImportSourceTabs } from '@/components/recipes/import/import-source-tabs'
import { ImportTextForm } from '@/components/recipes/import/import-text-form'
import { ImportUrlForm } from '@/components/recipes/import/import-url-form'
import { Button } from '@/components/shared/Button'
import { PageHeader } from '@/components/shared/PageHeader'

import { useRecipeImport } from '@/hooks/use-recipe-import'

import { recipesTexts } from '@/constants/texts/recipes'

const ImportRecipePage = () => {
    const [tab, setTab] = useState<'url' | 'text'>('url')
    const [url, setUrl] = useState('')
    const [text, setText] = useState('')
    const [textImageUrl, setTextImageUrl] = useState('')

    const {
        recipe,
        error,
        isImporting,
        isSaving,
        importFromUrl,
        importFromText,
        setTitle,
        save
    } = useRecipeImport()

    const isUrlTab = tab === 'url'
    const isSubmitDisabled = isImporting || (isUrlTab ? url.trim().length === 0 : text.trim().length === 0)

    const handleSubmit = () => {
        if (isUrlTab) importFromUrl(url.trim())
        else importFromText(text.trim(), textImageUrl.trim() || undefined)
    }

    return (
        <main className={'mx-auto w-full max-w-(--breakpoint-lg) px-4 py-6'}>
            <PageHeader
                title={recipesTexts.import.title}
                className={'mb-1.5'}
            />
            {recipe
                ? (
                    <ImportRecipeReview
                        recipe={recipe}
                        isSaving={isSaving}
                        onTitleChange={setTitle}
                        onSave={save}
                    />
                )
                : (
                    <>
                        <p className={'mb-5.5 text-body text-ink-3'}>
                            {recipesTexts.import.subtitle}
                        </p>
                        <ImportSourceTabs
                            tab={tab}
                            onChange={setTab}
                        />
                        <div className={'mb-4.5 rounded-lg border border-border-2 bg-surface p-5'}>
                            {isUrlTab
                                ? (
                                    <ImportUrlForm
                                        url={url}
                                        onUrlChange={setUrl}
                                    />
                                )
                                : (
                                    <ImportTextForm
                                        text={text}
                                        onTextChange={setText}
                                        imageUrl={textImageUrl}
                                        onImageUrlChange={setTextImageUrl}
                                    />
                                )}
                        </div>
                        <Button
                            type={'button'}
                            disabled={isSubmitDisabled}
                            onClick={handleSubmit}
                            className={'w-full'}
                        >
                            {isImporting
                                ? recipesTexts.import.importing
                                : recipesTexts.import.submit}
                        </Button>
                        {error && (
                            <p className={'mt-3 text-label text-status-red-fg'}>
                                {error}
                            </p>
                        )}
                    </>
                )}
        </main>
    )
}

export default ImportRecipePage
