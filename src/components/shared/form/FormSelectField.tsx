import type {
    Control,
    FieldValues,
    Path
} from 'react-hook-form'

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'

type FormSelectFieldOption<T extends string> = {
    value: T
    label: string
}

type FormSelectFieldProps<T extends FieldValues, V extends string> = {
    control: Control<T>
    name: Path<T>
    label: string
    placeholder?: string
    options: FormSelectFieldOption<V>[]
}

export const FormSelectField = <T extends FieldValues, V extends string>({
    control,
    name,
    label,
    placeholder,
    options
}: FormSelectFieldProps<T, V>) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem>
                <FormLabel>
                    {label}
                </FormLabel>
                <Select
                    value={field.value ?? ''}
                    onValueChange={field.onChange}
                >
                    <FormControl>
                        <SelectTrigger className={'w-full'}>
                            <SelectValue placeholder={placeholder}/>
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {options.map((option) => (
                            <SelectItem
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormMessage/>
            </FormItem>
        )}
    />
)
