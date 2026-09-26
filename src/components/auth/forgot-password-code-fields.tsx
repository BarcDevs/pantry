'use client'

import type { UseFormReturn } from 'react-hook-form'

import { DevCodeHint } from '@/components/auth/dev-code-hint'
import { OtpInput } from '@/components/auth/otp-input'
import { PrimaryButton } from '@/components/shared/buttons/PrimaryButton'
import { FormError } from '@/components/shared/form/FormError'
import { FormInputField } from '@/components/shared/form/FormInputField'
import { Form } from '@/components/ui/form'

import { authTexts } from '@/constants/texts/auth'

import type { CodeFormValues } from '@/schemas/forgot-password-form'

type ForgotPasswordCodeFieldsProps = {
    form: UseFormReturn<CodeFormValues>
    isSubmitting: boolean
    onSubmitAction: () => void
    devCode?: string
}

export const ForgotPasswordCodeFields = ({
    form,
    isSubmitting,
    onSubmitAction,
    devCode
}: ForgotPasswordCodeFieldsProps) => (
    <Form {...form}>
        <DevCodeHint code={devCode}/>
        <form
            onSubmit={onSubmitAction}
            className={'mt-6 flex flex-col gap-4'}
        >
            <FormInputField
                control={form.control}
                name={'code'}
                label={authTexts.resetCodeLabel}
                render={(field) => <OtpInput {...field}/>}
            />
            <FormError errors={form.formState.errors}/>
            <PrimaryButton
                type={'submit'}
                disabled={isSubmitting}
                className={'w-full'}
            >
                {authTexts.verifyCodeSubmit}
            </PrimaryButton>
        </form>
    </Form>
)
