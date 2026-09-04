import { Button } from '@/components/shared/Button'
import { Input } from '@/components/ui/input'

import { recipesTexts } from '@/constants/texts/recipes'

type ImportUrlFormProps = {
    url: string
    onUrlChange: (url: string) => void
    onSubmit: () => void
    isSubmitting: boolean
    error: string | null
}

export const ImportUrlForm = ({
    url,
    onUrlChange,
    onSubmit,
    isSubmitting,
    error
}: ImportUrlFormProps) => (
    <div className={'flex flex-col gap-3 rounded-lg border border-border-2 bg-surface p-5'}>
        <label className={'text-label font-bold text-ink'}>
            {recipesTexts.import.urlLabel}
        </label>
        <Input
            dir={'ltr'}
            value={url}
            placeholder={recipesTexts.import.urlPlaceholder}
            onChange={(e) => onUrlChange(e.target.value)}
            className={'text-left'}
        />
        <Button
            type={'button'}
            disabled={isSubmitting || url.trim().length === 0}
            onClick={onSubmit}
        >
            {isSubmitting
                ? recipesTexts.import.importing
                : recipesTexts.import.urlSubmit}
        </Button>
        {error && (
            <span className={'text-label text-status-red-fg'}>
                {error}
            </span>
        )}
    </div>
)
