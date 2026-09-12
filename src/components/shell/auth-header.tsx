'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { Button } from '@/components/shared/Button'

import { routes } from '@/constants/routes'
import { authTexts } from '@/constants/texts/auth'

export const AuthHeader = () => {
    const { data: session, status } = useSession()

    if (status === 'loading') return null

    return (
        <header className={'flex items-center justify-end gap-2 px-4 py-3 border-b border-border'}>
            {session
                ? (
                    <Link href={routes.settings}>
                        {session.user?.name ?? session.user?.email}
                    </Link>
                )
                : (
                    <>
                        <Button asChild
variant={'outline'}>
                            <Link href={routes.signIn}>
                                {authTexts.signInBtn}
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={routes.signUp}>
                                {authTexts.signUpBtn}
                            </Link>
                        </Button>
                    </>
                )}
        </header>
    )
}
