import type { ComponentProps } from 'react'

import { Input as UiInput } from '@/components/ui/input'

import { cn } from '@/lib/utils'

type InputProps = ComponentProps<typeof UiInput>

export const Input = ({
    className,
    ...props
}: InputProps) => (
    <UiInput
        className={cn('bg-surface', className)}
        {...props}
    />
)
