'use client'

import Link from 'next/link'

import { AuthHeading } from '@/components/auth/auth-heading'
import { GoogleAuthButton } from '@/components/auth/google-auth-button'
import { SignUpFields } from '@/components/auth/sign-up-fields'

import { useSignUpForm } from '@/hooks/use-sign-up-form'

import { routes } from '@/constants/routes'
import { authTexts } from '@/constants/texts/auth'

export const SignUpForm = () => {
    const {
        form,
        isSubmitting,
        handleSubmit
    } = useSignUpForm()

    return (
        <div className={'w-full max-w-sm'}>
            <AuthHeading
                title={authTexts.signUpTitle}
                subtitle={authTexts.signUpSub}
            />

            <SignUpFields
                form={form}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
            />

            <div className={'my-5 flex items-center gap-3 text-label text-ink-4'}>
                <div className={'h-px flex-1 bg-border'}/>
                {authTexts.or}
                <div className={'h-px flex-1 bg-border'}/>
            </div>

            <GoogleAuthButton label={authTexts.registerGoogle}/>

            <p className={'mt-5 text-center text-body text-ink-3'}>
                {`${authTexts.hasAccount} `}
                <Link
                    href={routes.signIn}
                    className={'text-green font-semibold'}
                >
                    {authTexts.backToSignIn}
                </Link>
            </p>
        </div>
    )
}
