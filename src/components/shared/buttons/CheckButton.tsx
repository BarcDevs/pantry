import type { ComponentProps } from 'react'

import { Button } from '@/components/shared/buttons/Button'

import { cn } from '@/lib/utils'

type CheckButtonProps = Omit<ComponentProps<typeof Button>, 'variant' | 'aria-pressed'> & {
    isChecked: boolean
}

export const CheckButton = ({
    className,
    isChecked,
    ...props
}: CheckButtonProps) => (
    <Button
        variant={'ghost'}
        aria-pressed={isChecked}
        className={cn(
            'size-6 rounded-sm border-1.5 p-0 has-[>svg]:p-0',
            isChecked
                ? 'border-green bg-green hover:bg-green'
                : 'border-track bg-surface hover:bg-surface',
            className
        )}
        {...props}
    />
)
