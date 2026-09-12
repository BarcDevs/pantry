'use client'

import { signOut } from 'next-auth/react'

import { Button } from '@/components/shared/Button'

import { routes } from '@/constants/routes'
import { settingsTexts } from '@/constants/texts/settings'

export const LogoutButton = () => (
    <Button
        type={'button'}
        variant={'outline'}
        className={'w-full border-warning-border text-warning-fg'}
        onClick={() => signOut({ callbackUrl: routes.landing })}
    >
        {settingsTexts.logout}
    </Button>
)
