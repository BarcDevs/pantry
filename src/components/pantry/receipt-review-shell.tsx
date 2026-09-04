'use client'

import type { ReactNode } from 'react'

import type { ItemSource } from '@/types/enums'
import type { ScannedReceiptItem } from '@/types/receipt'

import { DuplicateItemDialog } from '@/components/pantry/add/duplicate-item-dialog'
import { ReceiptReviewList } from '@/components/pantry/receipt-review-list'
import { PageHeader } from '@/components/shared/PageHeader'

import { useReceiptReview } from '@/hooks/use-receipt-review'

type ReceiptReviewShellProps = {
    title: string
    source: typeof ItemSource.ReceiptScan | typeof ItemSource.ReceiptUrl
    children: (props: {
        onScanned: (items: ScannedReceiptItem[]) => void
    }) => ReactNode
}

export const ReceiptReviewShell = ({
    title,
    source,
    children
}: ReceiptReviewShellProps) => {
    const {
        rows,
        setScannedItems,
        toggleRow,
        setRowName,
        setRowQuantity,
        removeRow,
        selectAll,
        clearAll,
        confirm,
        isSubmitting,
        duplicates,
        resolveDuplicate
    } = useReceiptReview(source)

    const duplicate = duplicates[0] ?? null

    return (
        <main className={'mx-auto w-full max-w-(--breakpoint-lg) px-4 py-6'}>
            <PageHeader title={title}/>
            {rows.length > 0
                ? (
                    <ReceiptReviewList
                        rows={rows}
                        isSubmitting={isSubmitting}
                        onToggle={toggleRow}
                        onNameChange={setRowName}
                        onQuantityChange={setRowQuantity}
                        onRemove={removeRow}
                        onSelectAll={selectAll}
                        onClearAll={clearAll}
                        onConfirm={confirm}
                        onCancel={() => setScannedItems([])}
                    />
                )
                : children({ onScanned: setScannedItems })}
            <DuplicateItemDialog
                open={duplicate !== null}
                onOpenChange={(open) => {
                    if (!open && duplicate) {
                        resolveDuplicate(duplicate, 'separate')
                    }
                }}
                onMerge={() => duplicate && resolveDuplicate(duplicate, 'merge')}
                onKeepSeparate={() => duplicate && resolveDuplicate(duplicate, 'separate')}
            />
        </main>
    )
}
