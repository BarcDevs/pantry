'use client'

import { useRouter } from 'next/navigation'

import { ArrowRightIcon } from 'lucide-react'

import type { ClassName } from '@/types/react'

import { Button } from '@/components/shared/Button'

import { cn } from '@/lib/utils'

type PageHeaderProps = {
    title?: string
    className?: ClassName
}

export const PageHeader = ({ title, className }: PageHeaderProps) => {
    const router = useRouter()

    return (
        <div className={cn('mb-5 flex items-center gap-3.25', className)}>
            <Button
                type={'button'}
                variant={'ghost'}
                size={'icon'}
                onClick={() => router.back()}
                className={'shrink-0 p-0 text-ink shadow-none'}
            >
                <ArrowRightIcon className={'size-6'}/>
            </Button>
            {title && (
                <h1 className={'font-display text-title font-weight-title text-ink'}>
                    {title}
                </h1>
            )}
        </div>
    )
}
