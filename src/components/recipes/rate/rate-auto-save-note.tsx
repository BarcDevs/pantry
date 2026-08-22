import { BookmarkIcon } from 'lucide-react'

import { recipesTexts } from '@/constants/texts/recipes'

export const RateAutoSaveNote = () => (
    <div className={'my-5 flex items-center gap-2.25 rounded-xl border border-soft-green-border bg-soft-green-bg px-3.75 py-3.25'}>
        <BookmarkIcon
            size={18}
            className={'shrink-0 text-green'}
        />
        <span className={'text-caption font-bold text-green'}>
            {recipesTexts.rate.autoSaveNote}
        </span>
    </div>
)
