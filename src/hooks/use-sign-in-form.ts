import { useTransition } from 'react'

import { useRouter } from 'next/navigation'

import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useSignIn } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'

import { routes } from '@/constants/routes'
import { authTexts } from '@/constants/texts/auth'

const signInFormSchema = z.object({
    email: z.string().trim().email(),
    password: z.string().min(1)
})

export type SignInFormValues = z.infer<typeof signInFormSchema>

export const useSignInForm = () => {
    const router = useRouter()
    const { signIn } = useSignIn()

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
                const { error } = await signIn.password({
                    emailAddress: values.email,
                    password: values.password
                })

                if (error || signIn.status !== 'complete') {
                    form.setError('root', {
                        message: authTexts.signInError
                    })
                    return
                }

                await signIn.finalize()
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
