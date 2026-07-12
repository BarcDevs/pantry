import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'

type FormSelectOption<T extends string> = {
    value: T
    label: string
}

type FormSelectFieldProps<T extends string> = {
    id: string
    label: string
    value: T
    options: FormSelectOption<T>[]
    onChange: (value: T) => void
}

export const FormSelectField = <T extends string>({
    id,
    label,
    value,
    options,
    onChange
}: FormSelectFieldProps<T>) => (
    <div className={'flex flex-col gap-1.5'}>
        <Label htmlFor={id}>
            {label}
        </Label>
        <Select
            value={value}
            onValueChange={(next) => { if (next) onChange(next) }}
        >
            <SelectTrigger
                id={id}
                className={'w-full'}
            >
                <SelectValue>
                    {(current: T) => options.find((option) => option.value === current)?.label}
                </SelectValue>
            </SelectTrigger>
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
    </div>
)
