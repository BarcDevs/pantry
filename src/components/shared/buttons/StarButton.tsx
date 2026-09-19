import type { ComponentProps } from 'react'

import { Button } from '@/components/shared/buttons/Button'

import { cn } from '@/lib/utils'

type StarButtonProps = Omit<ComponentProps<typeof Button>, 'variant'>

export const StarButton = ({
    className,
    ...props
}: StarButtonProps) => (
    <Button
        variant={'ghost'}
        className={cn(
            'h-auto w-auto rounded-none p-0 hover:bg-transparent has-[>svg]:p-0',
            className
        )}
        {...props}
    />
)
