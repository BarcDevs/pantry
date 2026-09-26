'use client'

import Link from 'next/link'

import { AuthHeading } from '@/components/auth/auth-heading'
import { ForgotPasswordCodeFields } from '@/components/auth/forgot-password-code-fields'
import { ForgotPasswordNewPasswordFields } from '@/components/auth/forgot-password-new-password-fields'
import { ForgotPasswordRequestFields } from '@/components/auth/forgot-password-request-fields'
import { ResettingPasswordForSubtitle } from '@/components/auth/resetting-password-for-subtitle'

import { useForgotPasswordForm } from '@/hooks/use-forgot-password-form'

import { routes } from '@/constants/routes'
import { authTexts } from '@/constants/texts/auth'

type ForgotPasswordFormProps = {
    initialEmail?: string
    initialCode?: string
}

export const ForgotPasswordForm = ({
    initialEmail,
    initialCode
}: ForgotPasswordFormProps) => {
    const {
        step,
        email,
        devCode,
        request,
        code,
        newPassword
    } = useForgotPasswordForm({ initialEmail, initialCode })

    const subtitleByStep = {
        request: authTexts.forgotSub,
        code: authTexts.codeStepSub,
        password: <ResettingPasswordForSubtitle email={email}/>
    }

    return (
        <div className={'w-full max-w-sm'}>
            <AuthHeading
                title={authTexts.forgotTitle}
                subtitle={subtitleByStep[step]}
            />

            {step === 'request' && (
                <ForgotPasswordRequestFields
                    form={request.form}
                    isSubmitting={request.isSubmitting}
                    onSubmitAction={request.handleSubmit}
                />
            )}
            {step === 'code' && (
                <ForgotPasswordCodeFields
                    form={code.form}
                    isSubmitting={code.isSubmitting}
                    onSubmitAction={code.handleSubmit}
                    devCode={devCode}
                />
            )}
            {step === 'password' && (
                <ForgotPasswordNewPasswordFields
                    form={newPassword.form}
                    isSubmitting={newPassword.isSubmitting}
                    onSubmitAction={newPassword.handleSubmit}
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
