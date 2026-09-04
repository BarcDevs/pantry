import { Button } from '@/components/shared/Button'
import { Textarea } from '@/components/ui/textarea'

import { recipesTexts } from '@/constants/texts/recipes'

type ImportTextFormProps = {
    text: string
    onTextChange: (text: string) => void
    onSubmit: () => void
    isSubmitting: boolean
    error: string | null
}

export const ImportTextForm = ({
    text,
    onTextChange,
    onSubmit,
    isSubmitting,
    error
}: ImportTextFormProps) => (
    <div className={'flex flex-col gap-3 rounded-lg border border-border-2 bg-surface p-5'}>
        <label className={'text-label font-bold text-ink'}>
            {recipesTexts.import.textLabel}
        </label>
        <Textarea
            value={text}
            placeholder={recipesTexts.import.textPlaceholder}
            onChange={(e) => onTextChange(e.target.value)}
            rows={8}
        />
        <Button
            type={'button'}
            disabled={isSubmitting || text.trim().length === 0}
            onClick={onSubmit}
        >
            {isSubmitting
                ? recipesTexts.import.importing
                : recipesTexts.import.textSubmit}
        </Button>
        {error && (
            <span className={'text-label text-status-red-fg'}>
                {error}
            </span>
        )}
    </div>
)
