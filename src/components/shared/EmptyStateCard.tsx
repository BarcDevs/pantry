import Link from 'next/link'

import { Button } from '@/components/shared/Button'

type EmptyStateCardProps = {
    icon: string
    title: string
    subtitle: string
    ctaHref: string
    ctaLabel: string
}

export const EmptyStateCard = ({
    icon,
    title,
    subtitle,
    ctaHref,
    ctaLabel
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
    </div>
)
