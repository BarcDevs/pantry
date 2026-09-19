import type { ComponentProps } from 'react'

import { Button } from '@/components/shared/buttons/Button'

import { cn } from '@/lib/utils'

type OutlinedLinkButtonProps = Omit<
    ComponentProps<typeof Button>,
    'variant' | 'size'
>

export const OutlinedLinkButton = ({
    className,
    ...props
}: OutlinedLinkButtonProps) => (
    <Button
        variant={'ghost'}
        size={'xs'}
        className={cn(
            'h-auto border border-green px-2.5 py-1 text-caption font-semibold text-green',
            className
        )}
        {...props}
    />
)
