import { useTransition } from 'react'

import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { routes } from '@/constants/routes'
import { authTexts } from '@/constants/texts/auth'

import { signUp } from '@/actions/users/sign-up'
import {
    signUpFormSchema,
    type SignUpFormValues
} from '@/schemas/sign-up-form'

export const useSignUpForm = () => {
    const router = useRouter()

    const form = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            fullName: '',
            email: '',
            password: ''
        }
    })

    const [isSubmitting, startSubmitting] = useTransition()

    const handleSubmit = form.handleSubmit((values) => {
        startSubmitting(async () => {
            try {
                const result = await signUp(values)

                if (!result.success) {
                    form.setError('root', {
                        message: result.error === 'email-taken'
                            ? authTexts.signUpCredentialsError
                            : authTexts.signUpError
                    })
                    return
                }

                await signIn('credentials', {
                    email: values.email,
                    password: values.password,
                    redirect: false
                })
                router.push(routes.onboarding)
            } catch (error) {
                console.error(error)
                form.setError('root', {
                    message: authTexts.signUpError
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
