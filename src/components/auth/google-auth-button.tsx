'use client'

import { useState } from 'react'

import { signIn } from 'next-auth/react'

import { GoogleIcon } from '@/components/icons/google-icon'
import { Button } from '@/components/shared/Button'

import { routes } from '@/constants/routes'

type GoogleAuthButtonProps = {
    label: string
}

export const GoogleAuthButton = ({ label }: GoogleAuthButtonProps) => {
    const [isRedirecting, setIsRedirecting] = useState(false)

    const handleClick = async () => {
        setIsRedirecting(true)
        try {
            await signIn('google', { callbackUrl: routes.pantry })
        } catch (error) {
            console.error(error)
            setIsRedirecting(false)
        }
    }

    return (
        <Button
            type={'button'}
            variant={'outline'}
            disabled={isRedirecting}
            className={'w-full justify-center gap-2.5 border-border font-semibold'}
            onClick={handleClick}
        >
            <GoogleIcon/>
            {label}
        </Button>
    )
}
