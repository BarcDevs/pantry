import { ArrowUpDownIcon } from 'lucide-react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger
} from '@/components/ui/select'

type SortSelectOption<T extends string> = {
    value: T
    label: string
}

type SortSelectProps<T extends string> = {
    value: T
    onChange: (value: T) => void
    options: SortSelectOption<T>[]
    label: string
}

export const SortSelect = <T extends string>({
    value,
    onChange,
    options,
    label
}: SortSelectProps<T>) => {
    const currentLabel = options.find((option) => option.value === value)?.label ?? value

    return (
        <Select
            value={value}
            onValueChange={onChange}
        >
            <SelectTrigger className={'h-auto cursor-pointer gap-1.5 rounded-full border border-border bg-surface px-3.5 py-2 text-label font-semibold text-ink-2 shadow-none'}>
                <ArrowUpDownIcon size={14}/>
                <span>{`${label}: ${currentLabel}`}</span>
            </SelectTrigger>
            <SelectContent position={'popper'}>
                {options.map((option) => (
                    <SelectItem
                        key={option.value}
                        value={option.value}
                        className={'cursor-pointer'}
                    >
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}
