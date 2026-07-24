import type { ReactNode } from 'react'

import type { ClassName } from '@/types/react'

import { cn } from '@/lib/utils'

type EmptyStateProps = {
    message: ReactNode
    icon?: ReactNode
    className?: ClassName
}

export const EmptyState = ({
    message,
    icon,
    className = 'p-6'
}: EmptyStateProps) => (
    <div className={cn('text-center text-muted-foreground', className)}>
        {icon && (
            <div className={'mb-4 flex justify-center'}>
                {icon}
            </div>
        )}
        {typeof message === 'string' ? (
            <p className={'text-sm md:text-base'}>
                {message}
            </p>
        ) : message}
    </div>
)
