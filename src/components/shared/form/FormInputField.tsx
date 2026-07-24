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

type FormInputFieldProps<T extends FieldValues> = {
    control: Control<T>
    name: Path<T>
    label: string
    labelClassName?: ClassName
    render: (field: ControllerRenderProps<T, Path<T>>) => ReactNode
}

export const FormInputField = <T extends FieldValues>({
    control,
    name,
    label,
    labelClassName,
    render
}: FormInputFieldProps<T>) => (
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
