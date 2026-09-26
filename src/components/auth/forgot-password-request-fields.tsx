'use client'

import type { UseFormReturn } from 'react-hook-form'

import { PrimaryButton } from '@/components/shared/buttons/PrimaryButton'
import { FormError } from '@/components/shared/form/FormError'
import { FormInputField } from '@/components/shared/form/FormInputField'
import { LtrInput } from '@/components/shared/LtrInput'
import { Form } from '@/components/ui/form'

import { authTexts } from '@/constants/texts/auth'

import type { RequestFormValues } from '@/schemas/forgot-password-form'

type ForgotPasswordRequestFieldsProps = {
    form: UseFormReturn<RequestFormValues>
    isSubmitting: boolean
    onSubmitAction: () => void
}

export const ForgotPasswordRequestFields = ({
    form,
    isSubmitting,
    onSubmitAction
}: ForgotPasswordRequestFieldsProps) => (
    <Form {...form}>
        <form
            onSubmit={onSubmitAction}
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
            <FormError errors={form.formState.errors}/>
            <PrimaryButton
                type={'submit'}
                disabled={isSubmitting}
                className={'w-full'}
            >
                {authTexts.forgotSendCodeSubmit}
            </PrimaryButton>
        </form>
    </Form>
)
