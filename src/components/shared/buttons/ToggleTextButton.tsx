import type { ComponentProps } from 'react'

import { Button } from '@/components/shared/buttons/Button'

import { cn } from '@/lib/utils'

type ToggleTextButtonProps = Omit<ComponentProps<typeof Button>, 'variant'> & {
    isActive?: boolean
}

export const ToggleTextButton = ({
    className,
    isActive = false,
    size = 'xs',
    ...props
}: ToggleTextButtonProps) => (
    <Button
        variant={'ghost'}
        size={size}
        className={cn(
            'h-auto',
            isActive
                ? 'text-ink-3 underline'
                : 'border border-dashed border-warning-border text-status-amber-fg',
            className
        )}
        {...props}
    />
)
