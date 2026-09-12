import type { ComponentProps } from 'react'

import { Input } from '@/components/shared/Input'

import { cn } from '@/lib/utils'

type LtrInputProps = ComponentProps<typeof Input>

export const LtrInput = ({
    className,
    ...props
}: LtrInputProps) => (
    <Input
        dir={'ltr'}
        className={cn('text-left', className)}
        {...props}
    />
)
