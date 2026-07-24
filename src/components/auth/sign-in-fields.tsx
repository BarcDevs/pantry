'use client'

import Link from 'next/link'

import type { UseFormReturn } from 'react-hook-form'

import { PasswordInput } from '@/components/auth/password-input'
import { Button } from '@/components/shared/Button'
import { FormError } from '@/components/shared/form/FormError'
import { FormInputField } from '@/components/shared/form/FormInputField'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import type { SignInFormValues } from '@/hooks/use-sign-in-form'

import { routes } from '@/constants/routes'
import { authTexts } from '@/constants/texts/auth'

type SignInFieldsProps = {
    form: UseFormReturn<SignInFormValues>
    isSubmitting: boolean
    onSubmit: () => void
}

export const SignInFields = ({
    form,
    isSubmitting,
    onSubmit
}: SignInFieldsProps) => (
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
            <FormInputField
                control={form.control}
                name={'password'}
                label={authTexts.password}
                render={(field) => <PasswordInput {...field}/>}
            />
            <Link
                href={routes.forgotPassword}
                className={'-mt-2 self-start text-label text-green font-semibold'}
            >
                {authTexts.forgotPassword}
            </Link>
            <FormError errors={form.formState.errors}/>
            <Button
                type={'submit'}
                disabled={isSubmitting}
                className={'w-full'}
            >
                {authTexts.signInBtn}
            </Button>
        </form>
    </Form>
)
