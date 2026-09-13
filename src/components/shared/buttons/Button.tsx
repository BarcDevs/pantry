import type { ComponentProps } from 'react'

import * as UI from '@/components/ui/button'

import { cn } from '@/lib/utils'

type ButtonProps = ComponentProps<typeof UI.Button>

export const Button = ({
    className,
    variant = 'default',
    type = 'button',
    ...props
}: ButtonProps) => (
    <UI.Button
        variant={variant}
        type={type}
        className={cn(
            'cursor-pointer active:scale-[.985]',
            variant === 'default' && 'shadow-button',
            className
        )}
        {...props}
    />
)
