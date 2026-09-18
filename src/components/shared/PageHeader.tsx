'use client'

import { useRouter } from 'next/navigation'

import { ArrowRightIcon } from 'lucide-react'

import type { ClassName } from '@/types/react'

import { IconButton } from '@/components/shared/buttons/IconButton'

import { cn } from '@/lib/utils'

type PageHeaderProps = {
    title?: string
    className?: ClassName
}

export const PageHeader = ({ title, className }: PageHeaderProps) => {
    const router = useRouter()

    return (
        <div className={cn('mb-5 flex items-center gap-3.25', className)}>
            <IconButton
                onClick={() => router.back()}
                className={'p-0 text-ink'}
            >
                <ArrowRightIcon className={'size-6'}/>
            </IconButton>
            {title && (
                <h1 className={'font-display text-title font-weight-title text-ink'}>
                    {title}
                </h1>
            )}
        </div>
    )
}
