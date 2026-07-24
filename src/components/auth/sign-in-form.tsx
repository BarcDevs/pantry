'use client'

import Link from 'next/link'

import { AuthHeading } from '@/components/auth/auth-heading'
import { GoogleAuthButton } from '@/components/auth/google-auth-button'
import { SignInFields } from '@/components/auth/sign-in-fields'

import { useSignInForm } from '@/hooks/use-sign-in-form'

import { routes } from '@/constants/routes'
import { authTexts } from '@/constants/texts/auth'

export const SignInForm = () => {
    const {
        form,
        isSubmitting,
        handleSubmit
    } = useSignInForm()

    return (
        <div className={'w-full max-w-sm'}>
            <AuthHeading
                title={authTexts.signInTitle}
                subtitle={authTexts.signInSub}
            />

            <SignInFields
                form={form}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
            />

            <div className={'my-5 flex items-center gap-3 text-label text-ink-4'}>
                <div className={'h-px flex-1 bg-border'}/>
                {authTexts.or}
                <div className={'h-px flex-1 bg-border'}/>
            </div>

            <GoogleAuthButton label={authTexts.continueGoogle}/>

            <p className={'mt-5 text-center text-body text-ink-3'}>
                {`${authTexts.noAccount} `}
                <Link
                    href={routes.signUp}
                    className={'text-green font-semibold'}
                >
                    {authTexts.register}
                </Link>
            </p>
        </div>
    )
}
