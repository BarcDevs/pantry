import { TextButton } from '@/components/shared/buttons/TextButton'

import { pantryTexts } from '@/constants/texts/pantry'

type NameCorrectionNoticeProps = {
    revert: () => void
}

export const NameCorrectionNotice = ({
    revert
}: NameCorrectionNoticeProps) => (
    <div className={'-mt-2 flex items-center gap-1.5 text-caption text-ink-3'}>
        <span>
            {pantryTexts.addForm.nameCorrectedByAi}
        </span>
        <TextButton onClick={revert}>
            {pantryTexts.addForm.nameCorrectionRevert}
        </TextButton>
    </div>
)
