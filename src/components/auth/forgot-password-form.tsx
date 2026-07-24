'use client'

import Link from 'next/link'

import { AuthHeading } from '@/components/auth/auth-heading'
import { ForgotPasswordRequestFields } from '@/components/auth/forgot-password-request-fields'
import { ForgotPasswordResetFields } from '@/components/auth/forgot-password-reset-fields'

import { useForgotPasswordForm } from '@/hooks/use-forgot-password-form'

import { routes } from '@/constants/routes'
import { authTexts } from '@/constants/texts/auth'

export const ForgotPasswordForm = () => {
    const {
        requestForm,
        resetForm,
        pendingReset,
        isRequesting,
        isResetting,
        handleRequest,
        handleReset
    } = useForgotPasswordForm()

    return (
        <div className={'w-full max-w-sm'}>
            <AuthHeading
                title={authTexts.forgotTitle}
                subtitle={authTexts.forgotSub}
            />

            {pendingReset
                ? (
                    <ForgotPasswordResetFields
                        form={resetForm}
                        isSubmitting={isResetting}
                        onSubmit={handleReset}
                    />
                )
                : (
                    <ForgotPasswordRequestFields
                        form={requestForm}
                        isSubmitting={isRequesting}
                        onSubmit={handleRequest}
                    />
                )}

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
