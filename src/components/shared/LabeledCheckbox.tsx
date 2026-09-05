import { ClassName } from '@/types/react'

import { Checkbox } from '@/components/ui/checkbox'

import { cn } from '@/lib/utils'

type LabeledCheckboxProps = {
    checked: boolean
    onCheckedChange: (checked: boolean) => void
    label: string
    className?: ClassName
}

export const LabeledCheckbox = ({
    checked,
    onCheckedChange,
    label,
    className
}: LabeledCheckboxProps) => (
    <label className={cn(
        'flex cursor-pointer items-center gap-2', className
    )}>
        <Checkbox
            checked={checked}
            onCheckedChange={(next) => onCheckedChange(next === true)}
        />
        <span className={'text-caption text-ink-3'}>
            {label}
        </span>
    </label>
)
