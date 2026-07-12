import type { ComponentProps } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type FormInputFieldProps = {
    label: string
} & ComponentProps<typeof Input>

export const FormInputField = ({
    label,
    id,
    ...inputProps
}: FormInputFieldProps) => (
    <div className={'flex flex-col gap-1.5'}>
        <Label htmlFor={id}>
            {label}
        </Label>
        <Input
            id={id}
            {...inputProps}
        />
    </div>
)
