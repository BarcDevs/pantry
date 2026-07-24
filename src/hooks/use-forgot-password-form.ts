import { useState, useTransition } from 'react'

import { useRouter } from 'next/navigation'

import { useForm } from 'react-hook-form'

import { useSignIn } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'

import { routes } from '@/constants/routes'
import { authTexts } from '@/constants/texts/auth'

import {
    requestFormSchema,
    type RequestFormValues,
    resetFormSchema,
    type ResetFormValues
} from '@/schemas/forgot-password-form'

export const useForgotPasswordForm = () => {
    const router = useRouter()
    const { signIn } = useSignIn()
    const [pendingReset, setPendingReset] = useState(false)

    const requestForm = useForm<RequestFormValues>({
        resolver: zodResolver(requestFormSchema),
        defaultValues: { email: '' }
    })

    const resetForm = useForm<ResetFormValues>({
        resolver: zodResolver(resetFormSchema),
        defaultValues: {
            code: '',
            password: ''
        }
    })

    const [isRequesting, startRequesting] = useTransition()
    const [isResetting, startResetting] = useTransition()

    const handleRequest = requestForm.handleSubmit((values) => {
        startRequesting(async () => {
            try {
                const { error: createError } = await signIn.create({
                    identifier: values.email
                })
                if (createError) {
                    requestForm.setError('root', {
                        message: authTexts.forgotError
                    })
                    return
                }

                const { error } = await signIn.resetPasswordEmailCode.sendCode()
                if (error) {
                    requestForm.setError('root', {
                        message: authTexts.forgotError
                    })
                    return
                }

                setPendingReset(true)
            } catch (error) {
                console.error(error)
                requestForm.setError('root', {
                    message: authTexts.forgotError
                })
            }
        })
    })

    const handleReset = resetForm.handleSubmit((values) => {
        startResetting(async () => {
            try {
                const { error: verifyError } = await signIn.resetPasswordEmailCode.verifyCode({
                    code: values.code
                })
                if (verifyError) {
                    resetForm.setError('root', {
                        message: authTexts.forgotError
                    })
                    return
                }

                const { error } = await signIn.resetPasswordEmailCode.submitPassword({
                    password: values.password
                })

                if (error || signIn.status !== 'complete') {
                    resetForm.setError('root', {
                        message: authTexts.forgotError
                    })
                    return
                }

                await signIn.finalize()
                router.push(routes.pantry)
            } catch (error) {
                console.error(error)
                resetForm.setError('root', {
                    message: authTexts.forgotError
                })
            }
        })
    })

    return {
        requestForm,
        resetForm,
        pendingReset,
        isRequesting,
        isResetting,
        handleRequest,
        handleReset
    }
}
