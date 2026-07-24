'use client'

import { useState } from 'react'

import { Eye, EyeOff } from 'lucide-react'
import type { ComponentProps } from 'react'

import { Input } from '@/components/ui/input'

import { cn } from '@/lib/utils'

type PasswordInputProps = Omit<ComponentProps<typeof Input>, 'type'>

export const PasswordInput = ({
    className,
    ...props
}: PasswordInputProps) => {
    const [isVisible, setIsVisible] = useState(false)

    return (
        <div className={'relative'}>
            <Input
                type={isVisible ? 'text' : 'password'}
                dir={'ltr'}
                className={cn('text-left pr-3 pl-9', className)}
                {...props}
            />
            <button
                type={'button'}
                onClick={() => setIsVisible((prev) => !prev)}
                className={'absolute left-2.5 top-1/2 -translate-y-1/2 cursor-pointer text-ink-4'}
            >
                {isVisible
                    ? <EyeOff className={'size-4'}/>
                    : <Eye className={'size-4'}/>}
            </button>
        </div>
    )
}
