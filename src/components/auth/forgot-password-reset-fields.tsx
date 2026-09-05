'use client'

import type { UseFormReturn } from 'react-hook-form'

import { OtpInput } from '@/components/auth/otp-input'
import { PasswordInput } from '@/components/auth/password-input'
import { Button } from '@/components/shared/Button'
import { FormError } from '@/components/shared/form/FormError'
import { FormInputField } from '@/components/shared/form/FormInputField'
import { Form } from '@/components/ui/form'

import { authTexts } from '@/constants/texts/auth'

import type { ResetFormValues } from '@/schemas/forgot-password-form'

type ForgotPasswordResetFieldsProps = {
    form: UseFormReturn<ResetFormValues>
    isSubmitting: boolean
    onSubmit: () => void
}

export const ForgotPasswordResetFields = ({
    form,
    isSubmitting,
    onSubmit
}: ForgotPasswordResetFieldsProps) => (
    <Form {...form}>
        <form
            onSubmit={onSubmit}
            className={'mt-6 flex flex-col gap-4'}
        >
            <FormInputField
                control={form.control}
                name={'code'}
                label={authTexts.resetCodeLabel}
                render={(field) => <OtpInput {...field}/>}
            />
            <FormInputField
                control={form.control}
                name={'password'}
                label={authTexts.newPassword}
                render={(field) => <PasswordInput {...field}/>}
            />
            <FormError errors={form.formState.errors}/>
            <Button
                type={'submit'}
                disabled={isSubmitting}
                className={'w-full'}
            >
                {authTexts.forgotResetSubmit}
            </Button>
        </form>
    </Form>
)
