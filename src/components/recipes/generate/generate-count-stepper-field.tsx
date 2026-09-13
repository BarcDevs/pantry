import type {
    Control,
    FieldValues,
    Path
} from 'react-hook-form'

import { MinusIcon } from '@/components/icons/minus-icon'
import { PlusIcon } from '@/components/icons/plus-icon'
import { Button } from '@/components/shared/buttons/Button'
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
            <FormItem>
                <FormLabel>
                    {label}
                </FormLabel>
                <div className={'flex w-fit items-center gap-4'}>
                    <Button
                        variant={'ghost'}
                        size={'icon'}
                        className={'rounded-full border border-border bg-canvas'}
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
                    <Button
                        variant={'ghost'}
                        size={'icon'}
                        className={'rounded-full bg-green text-surface'}
                        onClick={() => field.onChange((field.value as number) + 1)}
                    >
                        <PlusIcon/>
                    </Button>
                </div>
            </FormItem>
        )}
    />
)
