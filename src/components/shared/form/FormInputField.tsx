import type { ReactNode } from 'react'
import type {
    Control,
    ControllerRenderProps,
    FieldValues,
    Path
} from 'react-hook-form'

import type { ClassName } from '@/types/react'

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'

import { cn } from '@/lib/utils'

type FormInputFieldProps<T extends FieldValues, N extends Path<T>> = {
    control: Control<T>
    name: N
    label: string
    labelClassName?: ClassName
    render: (field: ControllerRenderProps<T, N>) => ReactNode
}

export const FormInputField = <
    T extends FieldValues,
    N extends Path<T>
>({
    control,
    name,
    label,
    labelClassName,
    render
}: FormInputFieldProps<T, N>) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel className={cn(labelClassName)}>
                    {label}
                </FormLabel>
                <FormControl>
                    {render(field)}
                </FormControl>
                <FormMessage/>
            </FormItem>
        )}
    />
)
