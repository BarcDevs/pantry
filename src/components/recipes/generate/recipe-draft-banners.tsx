'use client'

import { RecipeDraftBanner } from '@/components/recipes/generate/recipe-draft-banner'

import { useRecipeDrafts } from '@/hooks/use-recipe-drafts'

export const RecipeDraftBanners = () => {
    const {
        drafts,
        dismiss
    } = useRecipeDrafts()

    if (drafts.length === 0) return null

    return (
        <div className={'mb-5 flex flex-col gap-2.5'}>
            {drafts.map((draft) => (
                <RecipeDraftBanner
                    key={draft.kind}
                    draft={draft}
                    onDismiss={() => dismiss(draft.kind)}
                />
            ))}
        </div>
    )
}
