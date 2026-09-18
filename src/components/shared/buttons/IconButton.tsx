import type { ComponentProps } from 'react'

import { Button } from '@/components/shared/buttons/Button'

import { cn } from '@/lib/utils'

type IconButtonProps = Omit<ComponentProps<typeof Button>, 'variant'>

export const IconButton = ({
    className,
    size = 'icon',
    ...props
}: IconButtonProps) => (
    <Button
        variant={'ghost'}
        size={size}
        className={cn('shrink-0 rounded-full', className)}
        {...props}
    />
)
