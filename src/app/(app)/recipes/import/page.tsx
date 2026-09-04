'use client'

import { useState } from 'react'

import { ImportRecipeReview } from '@/components/recipes/import/import-recipe-review'
import { ImportSourceTabs } from '@/components/recipes/import/import-source-tabs'
import { ImportTextForm } from '@/components/recipes/import/import-text-form'
import { ImportUrlForm } from '@/components/recipes/import/import-url-form'
import { PageHeader } from '@/components/shared/PageHeader'

import { useRecipeImport } from '@/hooks/use-recipe-import'

import { recipesTexts } from '@/constants/texts/recipes'

const ImportRecipePage = () => {
    const [tab, setTab] = useState<'url' | 'text'>('url')
    const [url, setUrl] = useState('')
    const [text, setText] = useState('')

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

    return (
        <main className={'mx-auto w-full max-w-(--breakpoint-lg) px-4 py-6'}>
            <PageHeader title={recipesTexts.import.title}/>
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
                    <div className={'flex flex-col gap-4'}>
                        <ImportSourceTabs
                            tab={tab}
                            onChange={setTab}
                        />
                        {tab === 'url'
                            ? (
                                <ImportUrlForm
                                    url={url}
                                    onUrlChange={setUrl}
                                    onSubmit={() => importFromUrl(url.trim())}
                                    isSubmitting={isImporting}
                                    error={error}
                                />
                            )
                            : (
                                <ImportTextForm
                                    text={text}
                                    onTextChange={setText}
                                    onSubmit={() => importFromText(text.trim())}
                                    isSubmitting={isImporting}
                                    error={error}
                                />
                            )}
                    </div>
                )}
        </main>
    )
}

export default ImportRecipePage
