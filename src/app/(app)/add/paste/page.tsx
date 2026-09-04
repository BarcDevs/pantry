'use client'

import { useState, useTransition } from 'react'

import { ItemSource } from '@/types/enums'

import { ReceiptReviewShell } from '@/components/pantry/receipt-review-shell'
import { ReceiptSourceTabs } from '@/components/pantry/receipt-source-tabs'
import { ReceiptUrlForm } from '@/components/pantry/receipt-url-form'

import { pantryTexts } from '@/constants/texts/pantry'

import { parseReceiptUrl } from '@/actions/pantry/parse-receipt-url'

const AddPastePage = () => {
    const [tab, setTab] = useState<'url' | 'text'>('url')
    const [url, setUrl] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isParsing, startParsing] = useTransition()

    return (
        <ReceiptReviewShell
            title={pantryTexts.pasteReceipt}
            source={ItemSource.ReceiptUrl}
        >
            {({ onScanned }) => {
                const handleSubmitUrl = () => {
                    setError(null)
                    startParsing(async () => {
                        const result = await parseReceiptUrl(url.trim())
                        if (result.fallbackToManual) {
                            setError(pantryTexts.receiptReview.urlError)
                            return
                        }
                        onScanned(result.items)
                    })
                }

                return (
                    <div className={'flex flex-col gap-4'}>
                        <ReceiptSourceTabs
                            tab={tab}
                            onChange={setTab}
                        />
                        {tab === 'url'
                            ? (
                                <ReceiptUrlForm
                                    url={url}
                                    onUrlChange={setUrl}
                                    onSubmit={handleSubmitUrl}
                                    isSubmitting={isParsing}
                                    error={error}
                                />
                            )
                            : (
                                <p className={'rounded-lg border border-border-2 bg-surface p-5 text-center text-body text-ink-3'}>
                                    {pantryTexts.receiptReview.textTabComingSoon}
                                </p>
                            )}
                    </div>
                )
            }}
        </ReceiptReviewShell>
    )
}

export default AddPastePage
