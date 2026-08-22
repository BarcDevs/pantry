import type {
    Control,
    FieldValues,
    Path
} from 'react-hook-form'

import { MinusIcon } from '@/components/icons/minus-icon'
import { PlusIcon } from '@/components/icons/plus-icon'
import { Button } from '@/components/shared/Button'
import {
    FormField,
    FormItem,
    FormLabel
} from '@/components/ui/form'

type GenerateCountStepperFieldProps<T extends FieldValues> = {
    control: Control<T>
    name: Path<T>
    label: string
    unitLabel: string
    min?: number
}

export const GenerateCountStepperField = <T extends FieldValues>({
    control,
    name,
    label,
    unitLabel,
    min = 1
}: GenerateCountStepperFieldProps<T>) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem className={'flex flex-row items-center justify-between rounded-lg border border-border-2 bg-surface p-4'}>
                <Button
                    type={'button'}
                    variant={'ghost'}
                    size={'icon'}
                    className={'rounded-full border border-border-2'}
                    disabled={(field.value as number) <= min}
                    onClick={() => field.onChange((field.value as number) - 1)}
                >
                    <MinusIcon/>
                </Button>
                <div className={'flex flex-col items-center gap-1'}>
                    <span className={'font-display text-title font-bold text-ink'}>
                        {field.value as number}
                    </span>
                    <span className={'text-caption text-ink-3'}>
                        {unitLabel}
                    </span>
                </div>
                <div className={'flex flex-col items-end gap-2'}>
                    <FormLabel>
                        {label}
                    </FormLabel>
                    <Button
                        type={'button'}
                        variant={'ghost'}
                        size={'icon'}
                        className={'rounded-full border border-border-2 bg-green text-surface'}
                        onClick={() => field.onChange((field.value as number) + 1)}
                    >
                        <PlusIcon/>
                    </Button>
                </div>
            </FormItem>
        )}
    />
)
