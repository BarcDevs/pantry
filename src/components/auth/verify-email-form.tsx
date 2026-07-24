'use client'

import type { UseFormReturn } from 'react-hook-form'

import { AuthHeading } from '@/components/auth/auth-heading'
import { VerifyEmailFields } from '@/components/auth/verify-email-fields'

import { authTexts } from '@/constants/texts/auth'

import type { VerifyFormValues } from '@/schemas/sign-up-form'

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
