'use client'

import { CookingHistoryList } from '@/components/recipes/history/cooking-history-list'
import { PageHeader } from '@/components/shared/PageHeader'

import { useCookingHistory } from '@/hooks/use-cooking-history'

import { recipesTexts } from '@/constants/texts/recipes'

const CookingHistoryPage = () => {
    const { rows, rate } = useCookingHistory()

    return (
        <main className={'mx-auto w-full max-w-(--breakpoint-lg) px-4 py-6'}>
            <PageHeader title={recipesTexts.history.title}/>
            <p className={'-mt-3 mb-5 text-label text-ink-3'}>
                {recipesTexts.history.subtitle}
            </p>
            {rows !== null && (
                <CookingHistoryList
                    rows={rows}
                    onRate={(row, value) => rate(row, value)}
                />
            )}
        </main>
    )
}

export default CookingHistoryPage
