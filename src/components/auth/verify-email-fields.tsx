'use client'

import type { UseFormReturn } from 'react-hook-form'

import { OtpInput } from '@/components/auth/otp-input'
import { Button } from '@/components/shared/Button'
import { FormError } from '@/components/shared/form/FormError'
import { FormInputField } from '@/components/shared/form/FormInputField'
import { Form } from '@/components/ui/form'

import { authTexts } from '@/constants/texts/auth'

import type { VerifyFormValues } from '@/schemas/sign-up-form'

type VerifyEmailFieldsProps = {
    form: UseFormReturn<VerifyFormValues>
    isSubmitting: boolean
    onSubmit: () => void
}

export const VerifyEmailFields = ({
    form,
    isSubmitting,
    onSubmit
}: VerifyEmailFieldsProps) => (
    <Form {...form}>
        <form
            onSubmit={onSubmit}
            className={'mt-6 flex flex-col gap-4'}
        >
            <FormInputField
                control={form.control}
                name={'code'}
                label={authTexts.verifyCodeLabel}
                render={(field) => <OtpInput {...field}/>}
            />
            <FormError errors={form.formState.errors}/>
            <Button
                type={'submit'}
                disabled={isSubmitting}
                className={'w-full'}
            >
                {authTexts.verifySubmit}
            </Button>
        </form>
    </Form>
)
