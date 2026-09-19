import { TextButton } from '@/components/shared/buttons/TextButton'

import { recipesTexts } from '@/constants/texts/recipes'

type RecipeDraftDismissButtonProps = {
    onDismiss: () => void
}

export const RecipeDraftDismissButton = ({
    onDismiss
}: RecipeDraftDismissButtonProps) => (
    <TextButton
        tone={'muted'}
        onClick={onDismiss}
        className={'mt-4.5 self-center'}
    >
        {recipesTexts.result.discardDraft}
    </TextButton>
)
