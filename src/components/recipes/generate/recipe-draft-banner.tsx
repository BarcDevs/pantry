import Link from 'next/link'

import { PrimaryButton } from '@/components/shared/buttons/PrimaryButton'
import { TextButton } from '@/components/shared/buttons/TextButton'

import type { RecipeDraft } from '@/hooks/use-recipe-drafts'

import { commonTexts } from '@/constants/texts/common'
import { recipesTexts } from '@/constants/texts/recipes'

type RecipeDraftBannerProps = {
    draft: RecipeDraft
    onDismiss: () => void
}

export const RecipeDraftBanner = ({
    draft,
    onDismiss
}: RecipeDraftBannerProps) => (
    <div className={'flex flex-wrap items-center gap-3 rounded-lg border border-border-2 bg-surface p-4'}>
        <span className={'flex min-w-0 flex-1 flex-col'}>
            <span className={'text-caption text-ink-3'}>
                {recipesTexts.generate.draftBannerLabel}
            </span>
            <span className={'truncate text-body font-bold text-ink'}>
                {draft.recipe.title}
            </span>
        </span>
        <TextButton
            tone={'muted'}
            onClick={onDismiss}
        >
            {recipesTexts.result.discardDraft}
        </TextButton>
        <PrimaryButton asChild>
            <Link href={draft.href}>
                {commonTexts.continue}
            </Link>
        </PrimaryButton>
    </div>
)
