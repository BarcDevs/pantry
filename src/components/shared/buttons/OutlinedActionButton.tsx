import type { ComponentProps } from 'react'

import { Button } from '@/components/shared/buttons/Button'

import { cn } from '@/lib/utils'

type OutlinedActionButtonProps = Omit<ComponentProps<typeof Button>, 'variant'>

export const OutlinedActionButton = ({
    className,
    ...props
}: OutlinedActionButtonProps) => (
    <Button
        variant={'outline'}
        className={cn(
            'h-auto gap-1.75 rounded-[14px] border-border bg-surface p-3.5 has-[>svg]:px-3.5 text-[15px] font-bold text-[#4a463d] shadow-none',
            className
        )}
        {...props}
    />
)
