import { useTransition } from 'react'

import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { routes } from '@/constants/routes'
import { authTexts } from '@/constants/texts/auth'

import {
    signInFormSchema,
    type SignInFormValues
} from '@/schemas/sign-in-form'

export const useSignInForm = () => {
    const router = useRouter()

    const form = useForm<SignInFormValues>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const [isSubmitting, startSubmitting] = useTransition()

    const handleSubmit = form.handleSubmit((values) => {
        startSubmitting(async () => {
            try {
                const result = await signIn('credentials', {
                    email: values.email,
                    password: values.password,
                    redirect: false
                })

                if (result?.error) {
                    form.setError('root', {
                        message: authTexts.signInError
                    })
                    return
                }

                router.push(routes.pantry)
            } catch (error) {
                console.error(error)
                form.setError('root', {
                    message: authTexts.signInError
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
