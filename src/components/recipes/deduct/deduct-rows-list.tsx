import type { DeductRow as DeductRowType } from '@/types/pantry-item'

import { DeductRow } from '@/components/recipes/deduct/deduct-row'

type DeductRowsListProps = {
    rows: DeductRowType[]
    onMinus: (pantryItemId: string) => void
    onPlus: (pantryItemId: string) => void
    onKeep: (pantryItemId: string) => void
    onDelete: (pantryItemId: string) => void
}

export const DeductRowsList = ({
    rows,
    onMinus,
    onPlus,
    onKeep,
    onDelete
}: DeductRowsListProps) => (
    <div className={'mb-5 rounded-xl border border-border-3 bg-surface px-4.5'}>
        {rows.map((row) => (
            <DeductRow
                key={row.pantryItemId}
                row={row}
                onMinus={() => onMinus(row.pantryItemId)}
                onPlus={() => onPlus(row.pantryItemId)}
                onKeep={() => onKeep(row.pantryItemId)}
                onDelete={() => onDelete(row.pantryItemId)}
            />
        ))}
    </div>
)
