import { Input } from '@/components/ui/input'

import { recipesTexts } from '@/constants/texts/recipes'

type ImportUrlFormProps = {
    url: string
    onUrlChange: (url: string) => void
}

export const ImportUrlForm = ({
    url,
    onUrlChange
}: ImportUrlFormProps) => (
    <div>
        <label className={'mb-1.75 block text-label font-semibold text-ink-2'}>
            {recipesTexts.import.urlLabel}
        </label>
        <Input
            dir={'ltr'}
            value={url}
            placeholder={recipesTexts.import.urlPlaceholder}
            onChange={(e) => onUrlChange(e.target.value)}
            className={'text-left'}
        />
        <p className={'mt-2 text-caption text-ink-4'}>
            {recipesTexts.import.urlHint}
        </p>
    </div>
)
