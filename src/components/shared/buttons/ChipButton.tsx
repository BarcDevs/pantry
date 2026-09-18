import type { ComponentProps } from 'react'

import { Button } from '@/components/shared/buttons/Button'

import { cn } from '@/lib/utils'

type ChipButtonProps = Omit<ComponentProps<typeof Button>, 'variant'> & {
    isSelected?: boolean
}

export const ChipButton = ({
    className,
    isSelected = false,
    ...props
}: ChipButtonProps) => (
    <Button
        variant={'ghost'}
        className={cn(
            'h-auto gap-1.5 rounded-full border px-3.5 py-2 text-label font-semibold',
            isSelected
                ? 'border-green bg-green text-white'
                : 'border-border bg-surface text-ink-2',
            className
        )}
        {...props}
    />
)
