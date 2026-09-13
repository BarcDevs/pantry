import Link from 'next/link'

import { Button } from '@/components/shared/buttons/Button'

type EmptyStateCardAction = {
    href: string
    label: string
}

type EmptyStateCardProps = {
    icon: string
    title: string
    subtitle: string
    ctaHref: string
    ctaLabel: string
    secondaryActions?: EmptyStateCardAction[]
}

export const EmptyStateCard = ({
    icon,
    title,
    subtitle,
    ctaHref,
    ctaLabel,
    secondaryActions
}: EmptyStateCardProps) => (
    <div className={'flex flex-col items-center gap-4 rounded-lg border border-border bg-surface py-16 text-center'}>
        <span className={'text-4xl'}>
            {icon}
        </span>
        <div>
            <div className={'text-heading font-bold text-ink'}>
                {title}
            </div>
            <div className={'mt-1 text-body text-ink-3'}>
                {subtitle}
            </div>
        </div>
        <Button asChild>
            <Link href={ctaHref}>
                {ctaLabel}
            </Link>
        </Button>
        {secondaryActions && secondaryActions.length > 0 && (
            <div className={'flex gap-3'}>
                {secondaryActions.map((action) => (
                    <Button
                        key={action.href}
                        asChild
                        variant={'outline'}
                    >
                        <Link href={action.href}>
                            {action.label}
                        </Link>
                    </Button>
                ))}
            </div>
        )}
    </div>
)
