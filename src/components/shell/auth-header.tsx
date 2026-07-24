'use client'

import { usePathname } from 'next/navigation'

import {
    Show,
    SignInButton,
    SignUpButton,
    UserButton
} from '@clerk/nextjs'

import { routes } from '@/constants/routes'

const AUTH_ROUTES: string[] = [
    routes.signIn,
    routes.signUp,
    routes.forgotPassword
]

export const AuthHeader = () => {
    const pathname = usePathname()
    if (
        AUTH_ROUTES.some((route) =>
            pathname.startsWith(route)
        )
    )
        return null

    return (
        <header className={'flex items-center justify-end gap-2 px-4 py-3 border-b border-border'}>
            <Show when={'signed-out'}>
                <SignInButton/>
                <SignUpButton/>
            </Show>
            <Show when={'signed-in'}>
                <UserButton/>
            </Show>
        </header>
    )
}
