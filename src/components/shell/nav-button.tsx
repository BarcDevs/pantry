import Link from 'next/link'

import type { NavButtonProps } from '@/types/nav'

import { cn } from '@/lib/utils'

export const NavButton = ({
    href,
    label,
    icon,
    active
}: NavButtonProps) => (
    <Link
        href={href}
        className={cn(
            'flex flex-col items-center gap-0.5',
            active ? 'text-green' : 'text-ink-3'
        )}
    >
        {icon}
        <span className={'text-nav-label font-bold'}>
            {label}
        </span>
    </Link>
)
