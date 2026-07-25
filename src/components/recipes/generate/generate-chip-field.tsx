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

type GenerateChipFieldProps<
    T extends FieldValues,
    V extends string
> = {
    control: Control<T>
    name: Path<T>
    label: string
    values: readonly V[]
    optionLabels: Record<V, string>
}

export const GenerateChipField = <
    T extends FieldValues,
    V extends string
>({
    control,
    name,
    label,
    values,
    optionLabels
}: GenerateChipFieldProps<T, V>) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel>
                    {label}
                </FormLabel>
                <div className={'flex flex-wrap gap-2'}>
                    {values.map((value) => (
                        <SelectableOption
                            key={value}
                            variant={'chip'}
                            emoji={''}
                            label={optionLabels[value]}
                            isSelected={field.value === value}
                            onSelect={() => field.onChange(value)}
                        />
                    ))}
                </div>
            </FormItem>
        )}
    />
)
