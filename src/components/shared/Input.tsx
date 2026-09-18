import type { ComponentProps, KeyboardEvent } from 'react'

import { Input as UiInput } from '@/components/ui/input'

import { cn } from '@/lib/utils'

type InputProps = ComponentProps<typeof UiInput> & {
    onEnter?: () => void
}

export const Input = ({
    className,
    onEnter,
    onKeyDown,
    ...props
}: InputProps) => {
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(event)
        if (event.key !== 'Enter' || event.nativeEvent.isComposing || !onEnter) return
        event.preventDefault()
        onEnter()
    }

    return (
        <UiInput
            className={cn('bg-surface', className)}
            onKeyDown={handleKeyDown}
            {...props}
        />
    )
}
