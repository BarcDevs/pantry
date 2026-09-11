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
    source: typeof ItemSource.ReceiptScan | typeof ItemSource.ReceiptUrl
    children: (props: {
        onScanned: (items: ScannedReceiptItem[]) => Promise<void>
    }) => ReactNode
}

export const ReceiptReviewShell = ({
    title,
    source,
    children
}: ReceiptReviewShellProps) => {
    const receiptReview = useReceiptReview(source)
    const duplicate = receiptReview.duplicates[0] ?? null
    const hasRows = receiptReview.rows.length > 0
    const isScan = source === ItemSource.ReceiptScan

    return (
        <main className={'mx-auto w-full max-w-(--breakpoint-lg) px-4 py-6'}>
            <PageHeader
                title={hasRows
                    ? (isScan ? pantryTexts.receiptReview.scanTitle : pantryTexts.receiptReview.urlTitle)
                    : title}
                className={hasRows ? 'mb-1.5' : undefined}
            />
            {hasRows && (
                <>
                    <p className={'mb-4.5 text-body text-ink-3'}>
                        {pantryTexts.receiptReview.subtitle}
                    </p>
                    <ReceiptSourceCard
                        icon={isScan ? '🧾' : '🔗'}
                        label={isScan
                            ? pantryTexts.receiptReview.scanSourceLabel
                            : pantryTexts.receiptReview.urlSourceLabel}
                        itemCount={receiptReview.rows.length}
                        allSelected={receiptReview.rows.every((row) => row.included)}
                        onToggleAll={receiptReview.toggleAll}
                        onClearAll={receiptReview.clearAll}
                    />
                </>
            )}
            {hasRows
                ? (
                    <ReceiptReviewList
                        rows={receiptReview.rows}
                        isSubmitting={receiptReview.isSubmitting}
                        rowActions={receiptReview.rowActions}
                        onConfirm={receiptReview.confirm}
                        onCancel={() => receiptReview.setScannedItems([])}
                    />
                )
                : children({ onScanned: receiptReview.setScannedItems })}
            <DuplicateItemDialog
                open={duplicate !== null}
                onOpenChange={(open) => {
                    if (!open && duplicate) {
                        receiptReview.resolveDuplicate(duplicate, 'separate')
                    }
                }}
                onMerge={() => duplicate && receiptReview.resolveDuplicate(duplicate, 'merge')}
                onKeepSeparate={() => duplicate && receiptReview.resolveDuplicate(duplicate, 'separate')}
            />
        </main>
    )
}
