import type { ComponentProps } from 'react'

import { Button } from '@/components/shared/buttons/Button'

import { cn } from '@/lib/utils'

type InputAdornmentButtonProps = Omit<ComponentProps<typeof Button>, 'variant'>

export const InputAdornmentButton = ({
    className,
    ...props
}: InputAdornmentButtonProps) => (
    <Button
        variant={'ghost'}
        className={cn(
            'absolute left-2.5 top-1/2 h-auto w-auto -translate-y-1/2 p-0 text-ink-4 hover:bg-transparent hover:text-ink-4 has-[>svg]:p-0',
            className
        )}
        {...props}
    />
)
