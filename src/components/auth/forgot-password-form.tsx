'use client'

import Link from 'next/link'

import { AuthHeading } from '@/components/auth/auth-heading'
import { ForgotPasswordFields } from '@/components/auth/forgot-password-fields'

import { useForgotPasswordForm } from '@/hooks/use-forgot-password-form'

import { routes } from '@/constants/routes'
import { authTexts } from '@/constants/texts/auth'

export const ForgotPasswordForm = () => {
    const {
        form,
        isSubmitting,
        handleSubmit
    } = useForgotPasswordForm()

    return (
        <div className={'w-full max-w-sm'}>
            <AuthHeading
                title={authTexts.forgotTitle}
                subtitle={authTexts.forgotSub}
            />

            <ForgotPasswordFields
                form={form}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
            />

            <p className={'mt-5 text-center text-body text-ink-3'}>
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
