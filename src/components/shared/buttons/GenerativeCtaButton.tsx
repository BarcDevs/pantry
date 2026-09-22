import type { ComponentProps } from 'react'

import { Button } from '@/components/shared/buttons/Button'

import { cn } from '@/lib/utils'

type GenerativeCtaButtonProps = Omit<ComponentProps<typeof Button>, 'variant'>

/**
 * Orange "generative" CTA per design_system.md - reserved for AI recipe
 * generation entry points only, never ordinary confirm actions (those stay
 * `PrimaryButton` green).
 */
export const GenerativeCtaButton = ({
    className,
    ...props
}: GenerativeCtaButtonProps) => (
    <Button
        variant={'default'}
        className={cn(
            'h-auto rounded-[14px] bg-ember p-4 font-bold text-white shadow-button-ember hover:bg-ember/90',
            className
        )}
        {...props}
    />
)
