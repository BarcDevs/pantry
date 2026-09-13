import type { ComponentProps } from 'react'

import { Button } from '@/components/shared/buttons/Button'

import { cn } from '@/lib/utils'

type Tone = 'green' | 'red' | 'muted' | 'surface' | 'ink'

const toneClasses: Record<Tone, string> = {
    green: 'text-green',
    red: 'text-status-red-fg',
    muted: 'text-ink-3',
    surface: 'text-surface',
    ink: 'text-ink'
}

type TextButtonProps = ComponentProps<typeof Button> & {
    tone?: Tone
}

export const TextButton = ({
    tone = 'green',
    className,
    ...props
}: TextButtonProps) => (
    <Button
        variant={'ghost'}
        className={cn(
            'h-auto w-fit p-0 font-bold',
            toneClasses[tone],
            className
        )}
        {...props}
    />
)
