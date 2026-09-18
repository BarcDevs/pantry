import type { ComponentProps } from 'react'

import { Button } from '@/components/shared/buttons/Button'

import { cn } from '@/lib/utils'

type SurfaceButtonProps = Omit<ComponentProps<typeof Button>, 'variant'>

export const SurfaceButton = ({ className, ...props }: SurfaceButtonProps) => (
    <Button
        variant={'ghost'}
        className={cn('h-auto w-full justify-start text-start font-normal', className)}
        {...props}
    />
)
