'use client'

import { useRef, useState } from 'react'

import type { ScannedReceiptItem } from '@/types/receipt'

import { fileToBase64 } from '@/lib/pantry/file-to-base64'
import { renderPdfFirstPageToBase64 } from '@/lib/pantry/render-pdf-first-page'

import { pantryTexts } from '@/constants/texts/pantry'

import { scanReceipt } from '@/actions/pantry/scan-receipt'

type ReceiptUploadProps = {
    onScanned: (items: ScannedReceiptItem[]) => void
}

const maxUploadBytes = 8 * 1024 * 1024
const allowedImageTypes = new Set([
    'image/jpeg',
    'image/png',
    'image/webp'
])

export const ReceiptUpload = ({ onScanned }: ReceiptUploadProps) => {
    const [isScanning, setIsScanning] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFile = async (file: File) => {
        setError(null)
        if (file.size > maxUploadBytes) {
            setError(pantryTexts.receiptReview.fileTooLarge)
            return
        }
        const isPdf = file.type === 'application/pdf'
        if (!isPdf && !allowedImageTypes.has(file.type)) {
            setError(pantryTexts.receiptReview.unsupportedFileType)
            return
        }
        setIsScanning(true)
        try {
            const base64 = isPdf
                ? await renderPdfFirstPageToBase64(file)
                : await fileToBase64(file)
            const mimeType = isPdf ? 'image/png' : file.type
            const items = await scanReceipt(base64, mimeType)
            onScanned(items)
        } catch {
            setError(pantryTexts.receiptReview.scanError)
        } finally {
            setIsScanning(false)
            if (inputRef.current) inputRef.current.value = ''
        }
    }

    return (
        <div className={'flex flex-col items-center gap-3 rounded-lg border border-border-2 bg-surface p-8 text-center'}>
            <span className={'text-4xl'}>{'🧾'}</span>
            <p className={'text-body font-bold text-ink'}>
                {pantryTexts.receiptReview.uploadPrompt}
            </p>
            <p className={'text-caption text-ink-3'}>
                {pantryTexts.receiptReview.uploadHint}
            </p>
            <input
                ref={inputRef}
                type={'file'}
                accept={'image/jpeg,image/png,image/webp,application/pdf'}
                disabled={isScanning}
                className={'hidden'}
                id={'receipt-file-input'}
                onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) void handleFile(file)
                }}
            />
            <label
                htmlFor={'receipt-file-input'}
                className={'mt-2 cursor-pointer rounded-lg bg-green px-5 py-3 text-body font-bold text-white shadow-button'}
            >
                {isScanning
                    ? pantryTexts.receiptReview.scanning
                    : pantryTexts.receiptReview.uploadButton}
            </label>
            {error && (
                <p className={'text-label text-status-red-fg'}>
                    {error}
                </p>
            )}
        </div>
    )
}
