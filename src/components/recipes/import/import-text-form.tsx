import { ImageIcon } from 'lucide-react'

import { Input } from '@/components/shared/Input'
import { Textarea } from '@/components/ui/textarea'

import { recipesTexts } from '@/constants/texts/recipes'

type ImportTextFormProps = {
    text: string
    onTextChange: (text: string) => void
    imageUrl: string
    onImageUrlChange: (imageUrl: string) => void
}

export const ImportTextForm = ({
    text,
    onTextChange,
    imageUrl,
    onImageUrlChange
}: ImportTextFormProps) => (
    <div>
        <label className={'mb-1.75 block text-label font-semibold text-ink-2'}>
            {recipesTexts.import.textLabel}
        </label>
        <Textarea
            value={text}
            placeholder={recipesTexts.import.textPlaceholder}
            onChange={(e) => onTextChange(e.target.value)}
            className={'min-h-37.5'}
        />
        <label className={'mt-4 mb-1.75 flex items-center gap-1.5 text-label font-semibold text-ink-2'}>
            <ImageIcon className={'size-3.75 text-ink-3'}/>
            {recipesTexts.import.textImageLabel}
            <span className={'font-medium text-ink-4'}>
                {`· ${recipesTexts.import.textImageOptional}`}
            </span>
        </label>
        <Input
            dir={'ltr'}
            value={imageUrl}
            placeholder={recipesTexts.result.imageUrlPlaceholder}
            onChange={(e) => onImageUrlChange(e.target.value)}
        />
        <p className={'mt-2 text-caption text-ink-4'}>
            {recipesTexts.import.textImageHint}
        </p>
    </div>
)
