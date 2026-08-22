import type {
    Control,
    FieldValues,
    Path
} from 'react-hook-form'

import { Button } from '@/components/shared/Button'
import {
    FormField,
    FormItem,
    FormLabel
} from '@/components/ui/form'

import { cn } from '@/lib/utils'

import { pantryTexts } from '@/constants/texts/pantry'

const emojiOptions = [
    '🥬',
    '🍅',
    '🍗',
    '🥛',
    '🥚',
    '🧀',
    '🍚',
    '🍞',
    '🍎'
]

type EmojiPickerFieldProps<T extends FieldValues> = {
    control: Control<T>
    name: Path<T>
}

export const EmojiPickerField = <T extends FieldValues>({
    control,
    name
}: EmojiPickerFieldProps<T>) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel>
                    {pantryTexts.addForm.emojiLabel}
                </FormLabel>
                <div className={'flex flex-wrap gap-2'}>
                    {emojiOptions.map((emoji) => (
                        <Button
                            key={emoji}
                            type={'button'}
                            variant={'ghost'}
                            onClick={() => field.onChange(emoji)}
                            className={cn(
                                'size-10.5 rounded-md border p-0 text-body',
                                field.value === emoji
                                    ? 'border-2 border-green bg-soft-green-bg'
                                    : 'border-border-2 bg-surface'
                            )}
                        >
                            {emoji}
                        </Button>
                    ))}
                </div>
            </FormItem>
        )}
    />
)
