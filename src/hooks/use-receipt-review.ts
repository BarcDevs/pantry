import { useState, useTransition } from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'sonner'

import type { PantryUnit } from '@/types/enums'
import { ItemSource, StorageLocation } from '@/types/enums'
import type { AddPantryItemInput, AddPantryItemOutcome } from '@/types/pantry-item'
import type { ScannedReceiptItem } from '@/types/receipt'
import type {
    ReceiptReviewRow,
    ReceiptReviewRowActions,
    ReceiptReviewRowEditPatch
} from '@/types/receipt-review-row'

import { routes } from '@/constants/routes'
import { pantryTexts } from '@/constants/texts/pantry'

import { addPantryItems } from '@/actions/pantry/add-pantry-items'
import { suggestStorage } from '@/actions/pantry/suggest-storage'

type DuplicateOutcome = Extract<
    AddPantryItemOutcome,
    { status: 'duplicate' }
>

type PendingDuplicate = {
    rowId: string
    outcome: DuplicateOutcome
}

const toRow = (item: ScannedReceiptItem, index: number): ReceiptReviewRow => ({
    id: `${index}-${item.name}`,
    name: item.name,
    quantity: item.quantity,
    unit: item.unit,
    storage: StorageLocation.Pantry,
    type: null,
    expiryDate: '',
    storageSuggestion: null,
    included: true
})

export const useReceiptReview = (
    source: typeof ItemSource.ReceiptScan | typeof ItemSource.ReceiptUrl
) => {
    const router = useRouter()
    const [rows, setRows] = useState<ReceiptReviewRow[]>([])
    const [duplicates, setDuplicates] = useState<PendingDuplicate[]>([])
    const [isSubmitting, startSubmitting] = useTransition()

    const withSuggestion = async (row: ReceiptReviewRow): Promise<ReceiptReviewRow> => {
        try {
            const result = await suggestStorage(row.name)
            if (!result.recognized) return row
            const entry = result.expiryByStorage[result.suggestedStorage]
            return {
                ...row,
                storage: result.suggestedStorage,
                type: result.suggestedType ?? row.type,
                expiryDate: entry?.date ?? row.expiryDate,
                storageSuggestion: result
            }
        } catch (error) {
            console.error(error)
            return row
        }
    }

    // Suggestions are fetched for every row up front, before the rows are ever
    // shown - no per-row loading state or separate "suggest all" step on screen.
    const setScannedItems = async (items: ScannedReceiptItem[]) => {
        const suggestedRows = await Promise.all(items.map(toRow).map(withSuggestion))
        setRows(suggestedRows)
    }

    const toggleRow = (id: string) => setRows((prev) => prev.map(
        (row) => (row.id === id ? { ...row, included: !row.included } : row)
    ))

    const saveRowEdit = (id: string, patch: ReceiptReviewRowEditPatch) => setRows((prev) => prev.map(
        (row) => (row.id === id ? { ...row, ...patch } : row)
    ))

    const setRowQuantity = (id: string, quantity: number) => setRows((prev) => prev.map(
        (row) => (row.id === id ? { ...row, quantity } : row)
    ))

    const setRowUnit = (id: string, unit: PantryUnit) => setRows((prev) => prev.map(
        (row) => (row.id === id ? { ...row, unit } : row)
    ))

    const removeRow = (id: string) => setRows(
        (prev) => prev.filter((row) => row.id !== id)
    )

    const rowActions: ReceiptReviewRowActions = {
        onToggle: toggleRow,
        onQuantityChange: setRowQuantity,
        onUnitChange: setRowUnit,
        onEditSave: saveRowEdit,
        onRemove: removeRow
    }

    const toggleAll = () => setRows((prev) => {
        const allIncluded = prev.every((row) => row.included)
        return prev.map((row) => ({ ...row, included: !allIncluded }))
    })

    const clearAll = () => setRows(
        (prev) => prev.map((row) => ({ ...row, included: false }))
    )

    const buildInput = (row: ReceiptReviewRow): AddPantryItemInput => ({
        name: row.name.trim(),
        storage: row.storage,
        type: row.type,
        quantity: row.quantity,
        unit: row.unit,
        expiryDate: row.expiryDate ? new Date(row.expiryDate) : undefined,
        storageSuggestion: row.storageSuggestion,
        source
    })

    const finishIfDrained = (remainingRows: ReceiptReviewRow[]) => {
        if (remainingRows.length === 0) {
            toast.success(pantryTexts.receiptReview.saveSuccess)
            router.push(routes.pantry)
        }
    }

    const confirm = () => {
        const included = rows.filter((row) => row.included)
        startSubmitting(async () => {
            try {
                const outcomes = await addPantryItems(
                    included.map(buildInput)
                )
                const pendingDuplicates: PendingDuplicate[] = []
                const createdRowIds = new Set<string>()
                outcomes.forEach((outcome, index) => {
                    const rowId = included[index]?.id
                    if (!rowId) return
                    if (outcome.status === 'duplicate') {
                        pendingDuplicates.push({ rowId, outcome })
                        return
                    }
                    createdRowIds.add(rowId)
                })

                let remainingRows: ReceiptReviewRow[] = []
                setRows((prev) => {
                    remainingRows = prev.filter(
                        (row) => !createdRowIds.has(row.id)
                    )
                    return remainingRows
                })
                setDuplicates((prev) => [...prev, ...pendingDuplicates])

                if (pendingDuplicates.length === 0) {
                    finishIfDrained(remainingRows)
                }
            } catch {
                toast.error(pantryTexts.receiptReview.saveError)
            }
        })
    }

    const resolveDuplicate = (
        duplicate: PendingDuplicate,
        resolution: 'merge' | 'separate'
    ) => {
        setDuplicates((prev) => prev.filter((item) => item !== duplicate))
        startSubmitting(async () => {
            try {
                await addPantryItems([{
                    ...duplicate.outcome.incoming,
                    mergeWithId: resolution === 'merge'
                        ? duplicate.outcome.existing._id
                        : undefined,
                    forceSeparate: resolution === 'separate'
                }])
                let remainingRows: ReceiptReviewRow[] = []
                setRows((prev) => {
                    remainingRows = prev.filter(
                        (row) => row.id !== duplicate.rowId
                    )
                    return remainingRows
                })
                finishIfDrained(remainingRows)
            } catch {
                toast.error(pantryTexts.receiptReview.saveError)
            }
        })
    }

    return {
        rows,
        setScannedItems,
        rowActions,
        toggleAll,
        clearAll,
        confirm,
        isSubmitting,
        duplicates,
        resolveDuplicate
    }
}
