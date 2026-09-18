'use client'

import { useState, useTransition } from 'react'

import { useSearchParams } from 'next/navigation'

import { ItemSource } from '@/types/enums'

import { ReceiptReviewShell } from '@/components/pantry/receipt-review-shell'
import { ReceiptTextForm } from '@/components/pantry/receipt-text-form'
import { ReceiptUrlForm } from '@/components/pantry/receipt-url-form'

import { pantryTexts } from '@/constants/texts/pantry'

import { parseReceiptText } from '@/actions/pantry/parse-receipt-text'
import { parseReceiptUrl } from '@/actions/pantry/parse-receipt-url'

export const ReceiptPasteView = () => {
    const searchParams = useSearchParams()
    const isTextMode = searchParams.get('tab') === 'text'
    const [url, setUrl] = useState('')
    const [text, setText] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isBlocked, setIsBlocked] = useState(false)
    const [isParsing, startParsing] = useTransition()

    return (
        <ReceiptReviewShell
            title={isTextMode
                ? pantryTexts.addForm.pasteTextPageTitle
                : pantryTexts.addForm.pasteLinkTileTitle}
            isText={isTextMode}
            source={ItemSource.ReceiptUrl}
        >
            {({ onScanned }) => {
                const handleSubmitUrl = () => {
                    setError(null)
                    setIsBlocked(false)
                    startParsing(async () => {
                        const result = await parseReceiptUrl(url.trim())
                        if (result.fallbackToManual) {
                            setIsBlocked(result.isBlocked)
                            setError(pantryTexts.receiptReview.urlError)
                            return
                        }
                        await onScanned(result.items)
                    })
                }

                const handleSubmitText = () => {
                    setError(null)
                    startParsing(async () => {
                        const result = await parseReceiptText(text.trim())
                        if (result.items.length === 0) {
                            setError(pantryTexts.receiptReview.pasteTextError)
                            return
                        }
                        await onScanned(result.items)
                    })
                }

                return (
                    <div className={'flex flex-col gap-4'}>
                        <p className={'text-body text-ink-3'}>
                            {isTextMode
                                ? pantryTexts.receiptReview.pasteTextSubtitle
                                : pantryTexts.receiptReview.pasteLinkSubtitle}
                        </p>
                        {isTextMode
                            ? (
                                <ReceiptTextForm
                                    text={text}
                                    onTextChange={setText}
                                    onSubmit={handleSubmitText}
                                    isSubmitting={isParsing}
                                    error={error}
                                />
                            )
                            : (
                                <ReceiptUrlForm
                                    url={url}
                                    onUrlChange={setUrl}
                                    onSubmit={handleSubmitUrl}
                                    isSubmitting={isParsing}
                                    error={error}
                                    isBlocked={isBlocked}
                                />
                            )}
                    </div>
                )
            }}
        </ReceiptReviewShell>
    )
}
