import type {
    Control,
    FieldValues,
    Path
} from 'react-hook-form'

import { SelectableOption } from '@/components/shared/SelectableOption'
import {
    FormField,
    FormItem,
    FormLabel
} from '@/components/ui/form'

type GenerateToggleFieldProps<T extends FieldValues> = {
    control: Control<T>
    name: Path<T>
    label: string
    trueLabel: string
    falseLabel: string
}

export const GenerateToggleField = <T extends FieldValues>({
    control,
    name,
    label,
    trueLabel,
    falseLabel
}: GenerateToggleFieldProps<T>) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel>
                    {label}
                </FormLabel>
                <div className={'flex flex-wrap gap-2'}>
                    <SelectableOption
                        variant={'chip'}
                        emoji={''}
                        label={trueLabel}
                        isSelected={field.value === true}
                        onSelect={() => field.onChange(true)}
                    />
                    <SelectableOption
                        variant={'chip'}
                        emoji={''}
                        label={falseLabel}
                        isSelected={field.value === false}
                        onSelect={() => field.onChange(false)}
                    />
                </div>
            </FormItem>
        )}
    />
)
