'use client'

import { useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'

import type { FoodType, StorageLocation }
    from '@/types/enums'
import type { PantryItem }
    from '@/types/pantry-item'

import { EditItemDialog }
    from '@/components/pantry/edit/edit-item-dialog'
import { PantryFilterChips }
    from '@/components/pantry/pantry-filter-chips'
import { PantryGrid }
    from '@/components/pantry/pantry-grid'
import { PantryHeader }
    from '@/components/pantry/pantry-header'
import { PantrySearchInput }
    from '@/components/pantry/pantry-search-input'
import { PantryStatCards }
    from '@/components/pantry/pantry-stat-cards'
import { EmptyStateCard }
    from '@/components/shared/EmptyStateCard'

import { getExpiryStatus }
    from '@/lib/pantry/expiry-status'

import { routes }
    from '@/constants/routes'
import { pantryTexts }
    from '@/constants/texts/pantry'

type PantryViewProps = {
    items: PantryItem[]
    savedRecipesCount: number
    hasCookingHistory: boolean
    displayName: string
}

export const PantryView = ({
    items,
    savedRecipesCount,
    hasCookingHistory,
    displayName
}: PantryViewProps) => {
    const router = useRouter()
    const [query, setQuery] = useState('')
    const [filter, setFilter] = useState<
        StorageLocation | 'all'
    >('all')
    const [typeFilter, setTypeFilter] = useState<
        FoodType[]
    >([])
    const [editingItem, setEditingItem] = useState<
        PantryItem | null
    >(null)

    const expiringSoonCount = useMemo(
        () => items.filter((item) => {
            const status = getExpiryStatus(
                item.expiryDate
            )
            return status.tone === 'red'
                || status.tone === 'amber'
        }).length,
        [items]
    )

    const filteredItems = useMemo(
        () => items
            .filter(
                (item) => filter === 'all'
                    || item.storage === filter
            )
            .filter(
                (item) => typeFilter.length === 0
                    || (item.type !== null && typeFilter.includes(item.type))
            )
            .filter(
                (item) => item.name.includes(
                    query.trim()
                )
            ),
        [items, filter, typeFilter, query]
    )

    if (items.length === 0) {
        return (
            <div>
                <PantryHeader
                    displayName={displayName}
                    hasCookingHistory={hasCookingHistory}
                />
                <EmptyStateCard
                    icon={'🧺'}
                    title={pantryTexts.emptyTitle}
                    subtitle={pantryTexts.emptySub}
                    ctaHref={routes.add}
                    ctaLabel={pantryTexts.addItem}
                    secondaryActions={[
                        {
                            href: routes.addReceipt,
                            label: pantryTexts.scanReceipt
                        },
                        {
                            href: routes.addPaste,
                            label: pantryTexts.pasteReceipt
                        }
                    ]}
                />
            </div>
        )
    }

    return (
        <div>
            <PantryHeader
                displayName={displayName}
                hasCookingHistory={hasCookingHistory}
            />
            <PantryStatCards
                itemCount={items.length}
                expiringSoonCount={expiringSoonCount}
                savedRecipesCount={savedRecipesCount}
            />
            <PantrySearchInput
                value={query}
                onChange={setQuery}
            />
            <PantryFilterChips
                value={filter}
                onChange={setFilter}
                typeFilterValue={typeFilter}
                onTypeFilterChange={setTypeFilter}
            />
            {filteredItems.length === 0
                ? (
                    <p className={'py-10 text-center text-body text-ink-3'}>
                        {pantryTexts.noResults}
                    </p>
                )
                : (
                    <PantryGrid
                        items={filteredItems}
                        onEditItem={setEditingItem}
                    />
                )}
            {editingItem && (
                <EditItemDialog
                    item={editingItem}
                    onClose={() => setEditingItem(null)}
                    onSaved={() => {
                        setEditingItem(null)
                        router.refresh()
                    }}
                    onDeleted={() => {
                        setEditingItem(null)
                        router.refresh()
                    }}
                />
            )}
        </div>
    )
}
