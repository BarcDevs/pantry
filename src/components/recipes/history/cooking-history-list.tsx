import { CookingHistoryRowItem } from '@/components/recipes/history/cooking-history-row'

import type { CookingHistoryRow } from '@/hooks/use-cooking-history'

import { recipesTexts } from '@/constants/texts/recipes'

type CookingHistoryListProps = {
    rows: CookingHistoryRow[]
    onRate: (row: CookingHistoryRow, value: number) => void
}

export const CookingHistoryList = ({
    rows,
    onRate
}: CookingHistoryListProps) => {
    if (rows.length === 0) {
        return (
            <div className={'flex flex-col items-center gap-1.5 py-16 text-center'}>
                <span className={'text-4xl'}>{'🍲'}</span>
                <p className={'text-body font-bold text-ink-2'}>
                    {recipesTexts.history.empty}
                </p>
                <p className={'text-caption text-ink-3'}>
                    {recipesTexts.history.emptyHint}
                </p>
            </div>
        )
    }

    return (
        <div className={'flex flex-col gap-3'}>
            {rows.map((row) => (
                <CookingHistoryRowItem
                    key={row.entryId}
                    row={row}
                    onRate={(value) => onRate(row, value)}
                />
            ))}
        </div>
    )
}
