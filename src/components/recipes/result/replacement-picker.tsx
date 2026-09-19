import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'

import { cn } from '@/lib/utils'

import { recipesTexts } from '@/constants/texts/recipes'

type ReplacementPickerProps = {
    value: string
    options: string[]
    label: string
    onChange: (name: string) => void
    className?: string
}

export const ReplacementPicker = ({
    value,
    options,
    label,
    onChange,
    className
}: ReplacementPickerProps) => (
    <Select
        value={value}
        onValueChange={onChange}
    >
        <SelectTrigger
            aria-label={recipesTexts.result.replacementPickerLabel}
            className={cn(
                'w-auto cursor-pointer gap-1 border-0 bg-transparent p-0 text-caption font-bold shadow-none data-[size=default]:h-auto',
                className
            )}
        >
            <SelectValue>
                {label}
            </SelectValue>
        </SelectTrigger>
        <SelectContent position={'popper'}>
            {options.map((option) => (
                <SelectItem
                    key={option}
                    value={option}
                    className={'cursor-pointer'}
                >
                    {option}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
)
