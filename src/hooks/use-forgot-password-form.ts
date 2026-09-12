import { useState, useTransition } from 'react'

import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { routes } from '@/constants/routes'
import { authTexts } from '@/constants/texts/auth'

import { forgotPasswordRequest } from '@/actions/users/forgot-password-request'
import { forgotPasswordReset } from '@/actions/users/forgot-password-reset'
import {
    requestFormSchema,
    type RequestFormValues,
    resetFormSchema,
    type ResetFormValues
} from '@/schemas/forgot-password-form'

export const useForgotPasswordForm = () => {
    const router = useRouter()
    const [pendingReset, setPendingReset] = useState(false)
    const [devCode, setDevCode] = useState<string | undefined>(undefined)
    const [pendingEmail, setPendingEmail] = useState<string | null>(null)

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
                const result = await forgotPasswordRequest(values.email)
                if (!result.success) {
                    requestForm.setError('root', {
                        message: authTexts.forgotError
                    })
                    return
                }

                setPendingEmail(values.email)
                setDevCode(result.devCode)
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
                const email = pendingEmail
                if (!email) {
                    resetForm.setError('root', {
                        message: authTexts.forgotError
                    })
                    return
                }

                const success = await forgotPasswordReset({
                    email,
                    code: values.code,
                    password: values.password
                })

                if (!success) {
                    resetForm.setError('root', {
                        message: authTexts.forgotError
                    })
                    return
                }

                await signIn('credentials', {
                    email,
                    password: values.password,
                    redirect: false
                })
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
        devCode,
        isRequesting,
        isResetting,
        handleRequest,
        handleReset
    }
}
