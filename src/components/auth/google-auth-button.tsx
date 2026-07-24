'use client'

import { useState } from 'react'

import { useSignIn } from '@clerk/nextjs'

import { GoogleIcon } from '@/components/icons/google-icon'
import { Button } from '@/components/shared/Button'

import { routes } from '@/constants/routes'

type GoogleAuthButtonProps = {
    label: string
}

export const GoogleAuthButton = ({ label }: GoogleAuthButtonProps) => {
    const { signIn } = useSignIn()
    const [isRedirecting, setIsRedirecting] = useState(false)

    const handleClick = async () => {
        setIsRedirecting(true)
        try {
            await signIn.sso({
                strategy: 'oauth_google',
                redirectUrl: routes.pantry,
                redirectCallbackUrl: routes.ssoCallback
            })
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
