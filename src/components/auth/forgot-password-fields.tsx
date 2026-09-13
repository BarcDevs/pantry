'use client'

import type { UseFormReturn } from 'react-hook-form'

import { PasswordInput } from '@/components/auth/password-input'
import { Button } from '@/components/shared/Button'
import { FormError } from '@/components/shared/form/FormError'
import { FormInputField } from '@/components/shared/form/FormInputField'
import { LtrInput } from '@/components/shared/LtrInput'
import { Form } from '@/components/ui/form'

import { authTexts } from '@/constants/texts/auth'

import type { ForgotPasswordFormValues } from '@/schemas/forgot-password-form'

type ForgotPasswordFieldsProps = {
    form: UseFormReturn<ForgotPasswordFormValues>
    isSubmitting: boolean
    onSubmit: () => void
}

export const ForgotPasswordFields = ({
    form,
    isSubmitting,
    onSubmit
}: ForgotPasswordFieldsProps) => (
    <Form {...form}>
        <form
            onSubmit={onSubmit}
            className={'mt-6 flex flex-col gap-4'}
        >
            <FormInputField
                control={form.control}
                name={'email'}
                label={authTexts.email}
                render={(field) => (
                    <LtrInput
                        {...field}
                        type={'email'}
                    />
                )}
            />
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
