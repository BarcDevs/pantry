'use client'

import type { UseFormReturn } from 'react-hook-form'

import { Button } from '@/components/shared/Button'
import { FormError } from '@/components/shared/form/FormError'
import { FormInputField } from '@/components/shared/form/FormInputField'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import type { RequestFormValues } from '@/lib/schemas/forgot-password-form'

import { authTexts } from '@/constants/texts/auth'

type ForgotPasswordRequestFieldsProps = {
    form: UseFormReturn<RequestFormValues>
    isSubmitting: boolean
    onSubmit: () => void
}

export const ForgotPasswordRequestFields = ({
    form,
    isSubmitting,
    onSubmit
}: ForgotPasswordRequestFieldsProps) => (
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
                    <Input
                        {...field}
                        type={'email'}
                        dir={'ltr'}
                        className={'text-left'}
                    />
                )}
            />
            <FormError errors={form.formState.errors}/>
            <Button
                type={'submit'}
                disabled={isSubmitting}
                className={'w-full'}
            >
                {authTexts.forgotRequestSubmit}
            </Button>
        </form>
    </Form>
)
