import type { ComponentProps } from 'react'

import * as UI from '@/components/ui/button'

import { cn } from '@/lib/utils'

type ButtonProps = ComponentProps<typeof UI.Button>

export const Button = ({
    className,
    ...props
}: ButtonProps) => (
    <UI.Button
        className={cn(
            'cursor-pointer shadow-button active:scale-[.985]',
            className
        )}
        {...props}
    />
)
