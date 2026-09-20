'use client'

import type { ReactNode } from 'react'

import { ItemSource } from '@/types/enums'
import type { ScannedReceiptItem } from '@/types/receipt'

import { DuplicateItemDialog } from '@/components/pantry/add/duplicate-item-dialog'
import { ReceiptReviewList } from '@/components/pantry/receipt-review-list'
import { ReceiptSourceCard } from '@/components/pantry/receipt-source-card'
import { PageHeader } from '@/components/shared/PageHeader'

import { useReceiptReview } from '@/hooks/use-receipt-review'

import { pantryTexts } from '@/constants/texts/pantry'

type ReceiptReviewShellProps = {
    title: string
    isText?: boolean
    source: typeof ItemSource.ReceiptScan | typeof ItemSource.ReceiptUrl
    children: (props: {
        onScanned: (items: ScannedReceiptItem[]) => Promise<void>
    }) => ReactNode
}

const getReviewLabels = (isScan: boolean, isText: boolean) => {
    if (isScan) {
        return {
            reviewTitle: pantryTexts.receiptReview.scanTitle,
            sourceLabel: pantryTexts.receiptReview.scanSourceLabel,
            sourceIcon: '🧾'
        }
    }
    if (isText) {
        return {
            reviewTitle: pantryTexts.receiptReview.textTitle,
            sourceLabel: pantryTexts.receiptReview.textSourceLabel,
            sourceIcon: '📋'
        }
    }
    return {
        reviewTitle: pantryTexts.receiptReview.urlTitle,
        sourceLabel: pantryTexts.receiptReview.urlSourceLabel,
        sourceIcon: '🔗'
    }
}

export const ReceiptReviewShell = ({
    title,
    isText = false,
    source,
    children
}: ReceiptReviewShellProps) => {
    const receiptReview = useReceiptReview(source)
    const duplicate = receiptReview.duplicates.pending[0] ?? null
    const hasRows = receiptReview.rows.items.length > 0
    const isScan = source === ItemSource.ReceiptScan
    const {
        reviewTitle,
        sourceLabel,
        sourceIcon
    } = getReviewLabels(isScan, isText)

    return (
        <main className={'mx-auto w-full max-w-(--breakpoint-lg) px-4 py-6'}>
            <PageHeader
                title={hasRows ? reviewTitle : title}
                className={hasRows ? 'mb-1.5' : undefined}
            />
            {hasRows && (
                <>
                    <p className={'mb-4.5 text-body text-ink-3'}>
                        {pantryTexts.receiptReview.subtitle}
                    </p>
                    <ReceiptSourceCard
                        icon={sourceIcon}
                        label={sourceLabel}
                        itemCount={receiptReview.rows.items.length}
                        allSelected={receiptReview.rows.items.every((row) => row.included)}
                        onToggleAll={receiptReview.rows.toggleAll}
                        onClearAll={receiptReview.rows.clearAll}
                    />
                </>
            )}
            {hasRows
                ? (
                    <ReceiptReviewList
                        rows={receiptReview.rows.items}
                        isSubmitting={receiptReview.submission.isSubmitting}
                        rowActions={receiptReview.rows.actions}
                        onConfirm={receiptReview.submission.confirm}
                        onCancel={() => receiptReview.rows.setScannedItems([])}
                    />
                )
                : children({ onScanned: receiptReview.rows.setScannedItems })}
            <DuplicateItemDialog
                open={duplicate !== null}
                onOpenChange={(open) => {
                    if (!open && duplicate) {
                        receiptReview.duplicates.resolve(duplicate, 'separate')
                    }
                }}
                onMerge={() => duplicate && receiptReview.duplicates.resolve(duplicate, 'merge')}
                onKeepSeparate={() => duplicate && receiptReview.duplicates.resolve(duplicate, 'separate')}
            />
        </main>
    )
}
