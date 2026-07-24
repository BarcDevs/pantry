'use client'

import type { UseFormReturn } from 'react-hook-form'

import { AuthHeading } from '@/components/auth/auth-heading'
import { VerifyEmailFields } from '@/components/auth/verify-email-fields'

import type { VerifyFormValues } from '@/hooks/use-sign-up-form'

import { authTexts } from '@/constants/texts/auth'

type VerifyEmailFormProps = {
    form: UseFormReturn<VerifyFormValues>
    isSubmitting: boolean
    onSubmit: () => void
}

export const VerifyEmailForm = ({
    form,
    isSubmitting,
    onSubmit
}: VerifyEmailFormProps) => (
    <div className={'w-full max-w-sm'}>
        <AuthHeading
            title={authTexts.verifyTitle}
            subtitle={authTexts.verifySub}
        />

        <VerifyEmailFields
            form={form}
            isSubmitting={isSubmitting}
            onSubmit={onSubmit}
        />
    </div>
)
