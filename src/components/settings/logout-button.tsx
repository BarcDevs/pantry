'use client'

import { useClerk } from '@clerk/nextjs'

import { Button } from '@/components/shared/Button'

import { routes } from '@/constants/routes'
import { settingsTexts } from '@/constants/texts/settings'

export const LogoutButton = () => {
    const { signOut } = useClerk()

    return (
        <Button
            type={'button'}
            variant={'outline'}
            className={'w-full border-warning-border text-warning-fg'}
            onClick={() => signOut({ redirectUrl: routes.landing })}
        >
            {settingsTexts.logout}
        </Button>
    )
}
