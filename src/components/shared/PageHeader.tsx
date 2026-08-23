'use client'

import { useRouter } from 'next/navigation'

import { ArrowRightIcon } from 'lucide-react'

import { Button } from '@/components/shared/Button'

type PageHeaderProps = {
    title?: string
}

export const PageHeader = ({ title }: PageHeaderProps) => {
    const router = useRouter()

    return (
        <div className={'mb-5 flex items-center gap-3.25'}>
            <Button
                type={'button'}
                variant={'ghost'}
                size={'icon'}
                onClick={() => router.back()}
                className={'shrink-0 p-0 text-ink'}
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
