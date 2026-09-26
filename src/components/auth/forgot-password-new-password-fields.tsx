'use client'

import type { UseFormReturn } from 'react-hook-form'

import { PasswordInput } from '@/components/auth/password-input'
import { PrimaryButton } from '@/components/shared/buttons/PrimaryButton'
import { FormError } from '@/components/shared/form/FormError'
import { FormInputField } from '@/components/shared/form/FormInputField'
import { Form } from '@/components/ui/form'

import { authTexts } from '@/constants/texts/auth'

import type { NewPasswordFormValues } from '@/schemas/forgot-password-form'

type ForgotPasswordNewPasswordFieldsProps = {
    form: UseFormReturn<NewPasswordFormValues>
    isSubmitting: boolean
    onSubmitAction: () => void
}

export const ForgotPasswordNewPasswordFields = ({
    form,
    isSubmitting,
    onSubmitAction
}: ForgotPasswordNewPasswordFieldsProps) => (
    <Form {...form}>
        <form
            onSubmit={onSubmitAction}
            className={'mt-6 flex flex-col gap-4'}
        >
            <FormInputField
                control={form.control}
                name={'password'}
                label={authTexts.newPassword}
                render={(field) => <PasswordInput {...field}/>}
            />
            <FormInputField
                control={form.control}
                name={'confirmPassword'}
                label={authTexts.confirmNewPassword}
                render={(field) => <PasswordInput {...field}/>}
            />
            <FormError errors={form.formState.errors}/>
            <PrimaryButton
                type={'submit'}
                disabled={isSubmitting}
                className={'w-full'}
            >
                {authTexts.forgotResetSubmit}
            </PrimaryButton>
        </form>
    </Form>
)
