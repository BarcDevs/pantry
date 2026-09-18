import type { ComponentProps } from 'react'

import { Button } from '@/components/shared/buttons/Button'

import { cn } from '@/lib/utils'

type LinkButtonProps = Omit<ComponentProps<typeof Button>, 'variant'>

export const LinkButton = ({ className, ...props }: LinkButtonProps) => (
    <Button
        variant={'link'}
        className={cn('h-auto p-0 underline', className)}
        {...props}
    />
)
