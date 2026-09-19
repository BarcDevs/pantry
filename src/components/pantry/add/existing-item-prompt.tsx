import { SecondaryButton } from '@/components/shared/buttons/SecondaryButton'
import { TextButton } from '@/components/shared/buttons/TextButton'

import type { MergePrompt } from '@/hooks/use-add-item-form'

import { commonTexts } from '@/constants/texts/common'
import { pantryTexts } from '@/constants/texts/pantry'

type ExistingItemPromptProps = {
    prompt: MergePrompt
    onMerge: () => void
    onCancel: () => void
}

export const ExistingItemPrompt = ({
    prompt,
    onMerge,
    onCancel
}: ExistingItemPromptProps) => (
    <div className={'flex items-center justify-between gap-2.5 rounded-lg border border-warning-border bg-warning-bg p-3.5'}>
        <span className={'text-label font-bold text-warning-fg'}>
            {prompt.isMerging
                ? pantryTexts.addForm.mergingNotice(
                    prompt.existing.quantity,
                    prompt.addedQuantity,
                    prompt.total,
                    pantryTexts.unitShortLabels[prompt.existing.unit]
                )
                : pantryTexts.addForm.existingItemNotice}
        </span>
        {prompt.isMerging
            ? (
                <TextButton
                    tone={'muted'}
                    onClick={onCancel}
                >
                    {commonTexts.cancel}
                </TextButton>
            )
            : (
                <SecondaryButton
                    onClick={onMerge}
                    className={'h-auto shrink-0 px-3.5 py-2 text-caption'}
                >
                    {pantryTexts.addForm.mergeButton}
                </SecondaryButton>
            )}
    </div>
)
