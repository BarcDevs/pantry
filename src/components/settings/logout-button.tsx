'use client'

import { signOut } from 'next-auth/react'

import { SecondaryButton } from '@/components/shared/buttons/SecondaryButton'

import { routes } from '@/constants/routes'
import { settingsTexts } from '@/constants/texts/settings'

export const LogoutButton = () => (
    <SecondaryButton
        className={'w-full border-warning-border text-warning-fg'}
        onClick={() => signOut({ callbackUrl: routes.landing })}
    >
        {settingsTexts.logout}
    </SecondaryButton>
)
