'use client'

import type { UseFormReturn } from 'react-hook-form'

import { PasswordInput } from '@/components/auth/password-input'
import { Button } from '@/components/shared/Button'
import { FormError } from '@/components/shared/form/FormError'
import { FormInputField } from '@/components/shared/form/FormInputField'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import type { SignUpFormValues } from '@/lib/schemas/sign-up-form'

import { authTexts } from '@/constants/texts/auth'

type SignUpFieldsProps = {
    form: UseFormReturn<SignUpFormValues>
    isSubmitting: boolean
    onSubmit: () => void
}

export const SignUpFields = ({
    form,
    isSubmitting,
    onSubmit
}: SignUpFieldsProps) => (
    <Form {...form}>
        <form
            onSubmit={onSubmit}
            className={'mt-6 flex flex-col gap-4'}
        >
            <FormInputField
                control={form.control}
                name={'fullName'}
                label={authTexts.fullName}
                render={(field) => (
                    <Input
                        {...field}
                        placeholder={authTexts.fullNamePlaceholder}
                    />
                )}
            />
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
            <p className={'-mt-3 text-caption text-ink-4'}>
                {authTexts.passwordHint}
            </p>
            <FormError errors={form.formState.errors}/>
            <div id={'clerk-captcha'}/>
            <Button
                type={'submit'}
                disabled={isSubmitting}
                className={'w-full'}
            >
                {authTexts.signUpBtn}
            </Button>
        </form>
    </Form>
)
