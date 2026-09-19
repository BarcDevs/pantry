'use client'

import { signOut } from 'next-auth/react'

import { SecondaryButton } from '@/components/shared/buttons/SecondaryButton'

import { clearAllRecipeDrafts } from '@/lib/recipes/clear-all-recipe-drafts'

import { routes } from '@/constants/routes'
import { settingsTexts } from '@/constants/texts/settings'

export const LogoutButton = () => {
    const handleLogout = () => {
        clearAllRecipeDrafts()
        return signOut({ callbackUrl: routes.landing })
    }

    return (
        <SecondaryButton
            className={'w-full border-warning-border text-warning-fg'}
            onClick={handleLogout}
        >
            {settingsTexts.logout}
        </SecondaryButton>
    )
}
