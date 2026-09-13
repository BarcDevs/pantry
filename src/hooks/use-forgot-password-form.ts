import { useTransition } from 'react'

import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { routes } from '@/constants/routes'
import { authTexts } from '@/constants/texts/auth'

import { forgotPasswordReset } from '@/actions/users/forgot-password-reset'
import {
    forgotPasswordFormSchema,
    type ForgotPasswordFormValues
} from '@/schemas/forgot-password-form'

export const useForgotPasswordForm = () => {
    const router = useRouter()

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordFormSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: ''
        }
    })

    const [isSubmitting, startSubmitting] = useTransition()

    const handleSubmit = form.handleSubmit((values) => {
        startSubmitting(async () => {
            try {
                const success = await forgotPasswordReset({
                    email: values.email,
                    password: values.password
                })

                if (!success) {
                    form.setError('root', {
                        message: authTexts.forgotError
                    })
                    return
                }

                const result = await signIn('credentials', {
                    email: values.email,
                    password: values.password,
                    redirect: false
                })

                if (result?.error) {
                    form.setError('root', {
                        message: authTexts.forgotError
                    })
                    return
                }

                router.push(routes.pantry)
            } catch (error) {
                console.error(error)
                form.setError('root', {
                    message: authTexts.forgotError
                })
            }
        })
    })

    return {
        form,
        isSubmitting,
        handleSubmit
    }
}
