'use client'

import type { UseFormReturn } from 'react-hook-form'

import { PasswordInput } from '@/components/auth/password-input'
import { Button } from '@/components/shared/Button'
import { FormError } from '@/components/shared/form/FormError'
import { FormInputField } from '@/components/shared/form/FormInputField'
import { Input } from '@/components/shared/Input'
import { LtrInput } from '@/components/shared/LtrInput'
import { Form } from '@/components/ui/form'

import { authTexts } from '@/constants/texts/auth'

import type { SignUpFormValues } from '@/schemas/sign-up-form'

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
                    <LtrInput
                        {...field}
                        type={'email'}
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
