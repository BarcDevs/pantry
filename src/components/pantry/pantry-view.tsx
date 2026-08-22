'use client'

import { useMemo, useState } from 'react'

import { useRouter } from 'next/navigation'

import type { StorageLocation }
    from '@/types/enums'
import type { PantryItem }
    from '@/types/pantry-item'

import { EditItemSheet }
    from '@/components/pantry/edit/edit-item-sheet'
import { PantryEmptyState }
    from '@/components/pantry/pantry-empty-state'
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

import { getExpiryStatus }
    from '@/lib/pantry/expiry-status'

import { pantryTexts }
    from '@/constants/texts/pantry'

type PantryViewProps = {
    items: PantryItem[]
    savedRecipesCount: number
    displayName: string
}

export const PantryView = ({
    items,
    savedRecipesCount,
    displayName
}: PantryViewProps) => {
    const router = useRouter()
    const [query, setQuery] = useState('')
    const [filter, setFilter] = useState<
        StorageLocation | 'all'
    >('all')
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
                (item) => item.name.includes(
                    query.trim()
                )
            ),
        [items, filter, query]
    )

    if (items.length === 0) {
        return (
            <div>
                <PantryHeader displayName={displayName}/>
                <PantryEmptyState/>
            </div>
        )
    }

    return (
        <div>
            <PantryHeader displayName={displayName}/>
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
                <EditItemSheet
                    item={editingItem}
                    onClose={() => (
                        setEditingItem(null)
                    )}
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
