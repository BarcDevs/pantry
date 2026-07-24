'use client'

import type { UseFormReturn } from 'react-hook-form'

import { PasswordInput } from '@/components/auth/password-input'
import { Button } from '@/components/shared/Button'
import { FormError } from '@/components/shared/form/FormError'
import { FormInputField } from '@/components/shared/form/FormInputField'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import type { ResetFormValues } from '@/hooks/use-forgot-password-form'

import { authTexts } from '@/constants/texts/auth'

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
                render={(field) => (
                    <Input
                        {...field}
                        inputMode={'numeric'}
                        dir={'ltr'}
                        className={'text-left'}
                    />
                )}
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
