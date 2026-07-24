import { useState, useTransition } from 'react'

import { useRouter } from 'next/navigation'

import { useForm } from 'react-hook-form'

import { useSignUp } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'

import { routes } from '@/constants/routes'
import { authTexts } from '@/constants/texts/auth'

import {
    signUpFormSchema,
    type SignUpFormValues,
    verifyFormSchema,
    type VerifyFormValues
} from '@/schemas/sign-up-form'

export const useSignUpForm = () => {
    const router = useRouter()
    const { signUp } = useSignUp()
    const [pendingVerification, setPendingVerification] = useState(false)

    const form = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            fullName: '',
            email: '',
            password: ''
        }
    })

    const verifyForm = useForm<VerifyFormValues>({
        resolver: zodResolver(verifyFormSchema),
        defaultValues: { code: '' }
    })

    const [isSubmitting, startSubmitting] = useTransition()
    const [isVerifying, startVerifying] = useTransition()

    const handleSubmit = form.handleSubmit((values) => {
        startSubmitting(async () => {
            try {
                const nameParts = values.fullName
                    .trim()
                    .split(/\s+/)
                const [firstName, ...rest] = nameParts
                const { error } = await signUp.password({
                    firstName,
                    lastName: rest.join(' ') || undefined,
                    emailAddress: values.email,
                    password: values.password
                })

                if (error) {
                    form.setError('root', {
                        message: authTexts.signUpError
                    })
                    return
                }

                await signUp.verifications.sendEmailCode()
                setPendingVerification(true)
            } catch (error) {
                console.error(error)
                form.setError('root', {
                    message: authTexts.signUpError
                })
            }
        })
    })

    const handleVerify = verifyForm.handleSubmit((values) => {
        startVerifying(async () => {
            try {
                const { error } = await signUp.verifications.verifyEmailCode({
                    code: values.code
                })

                if (error || signUp.status !== 'complete') {
                    verifyForm.setError('root', {
                        message: authTexts.verifyError
                    })
                    return
                }

                await signUp.finalize()
                router.push(routes.onboarding)
            } catch (error) {
                console.error(error)
                verifyForm.setError('root', {
                    message: authTexts.verifyError
                })
            }
        })
    })

    return {
        form,
        verifyForm,
        pendingVerification,
        isSubmitting,
        isVerifying,
        handleSubmit,
        handleVerify
    }
}
