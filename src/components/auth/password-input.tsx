'use client'

import { useState } from 'react'

import {
    Eye,
    EyeOff
} from 'lucide-react'
import type { ComponentProps } from 'react'

import { InputAdornmentButton } from '@/components/shared/buttons/InputAdornmentButton'
import { Input } from '@/components/shared/Input'
import { LtrInput } from '@/components/shared/LtrInput'

import { cn } from '@/lib/utils'

type PasswordInputProps = Omit<ComponentProps<typeof Input>, 'type'>

export const PasswordInput = ({
    className,
    ...props
}: PasswordInputProps) => {
    const [isVisible, setIsVisible] = useState(false)

    return (
        <div className={'relative'}>
            <LtrInput
                type={isVisible ? 'text' : 'password'}
                className={cn('pr-3 pl-9', className)}
                {...props}
            />
            <InputAdornmentButton onClick={() => setIsVisible((prev) => !prev)}>
                {isVisible
                    ? <EyeOff className={'size-4'}/>
                    : <Eye className={'size-4'}/>}
            </InputAdornmentButton>
        </div>
    )
}
