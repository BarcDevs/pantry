import Link from 'next/link'

import type { NavButtonProps } from '@/types/nav'

import { cn } from '@/lib/utils'

export const NavItem = ({
    href,
    label,
    icon,
    active,
    disabled
}: NavButtonProps) => (
    <Link
        href={href}
        className={cn(
            'flex w-full items-center gap-3 rounded-md px-3.5 py-3 text-right text-body transition-colors',
            active && 'bg-status-green-bg text-green font-bold',
            !active && !disabled && 'text-ink-2 hover:bg-border-3 font-semibold',
            disabled && 'pointer-events-none cursor-not-allowed text-ink-4 opacity-50 font-semibold'
        )}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
        onClick={disabled ? (e) => e.preventDefault() : undefined}
    >
        {icon}
        {label}
    </Link>
)
