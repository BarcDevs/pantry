import {
    useState,
    useTransition
} from 'react'

import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { routes } from '@/constants/routes'
import { authTexts } from '@/constants/texts/auth'

import { forgotPasswordRequest } from '@/actions/users/forgot-password-request'
import { forgotPasswordReset } from '@/actions/users/forgot-password-reset'
import { verifyPasswordResetCode } from '@/actions/users/verify-password-reset-code'
import {
    codeFormSchema,
    type CodeFormValues,
    newPasswordFormSchema,
    type NewPasswordFormValues,
    requestFormSchema,
    type RequestFormValues
} from '@/schemas/forgot-password-form'

type Step = 'request' | 'code' | 'password'

type UseForgotPasswordFormInput = {
    initialEmail?: string
    initialCode?: string
}

export const useForgotPasswordForm = ({
    initialEmail,
    initialCode
}: UseForgotPasswordFormInput = {}) => {
    const router = useRouter()
    const [step, setStep] = useState<Step>(initialEmail && initialCode ? 'code' : 'request')
    const [email, setEmail] = useState(initialEmail ?? '')
    const [devCode, setDevCode] = useState<string | undefined>(undefined)

    const requestForm = useForm<RequestFormValues>({
        resolver: zodResolver(requestFormSchema),
        defaultValues: { email: initialEmail ?? '' }
    })

    const codeForm = useForm<CodeFormValues>({
        resolver: zodResolver(codeFormSchema),
        defaultValues: { code: initialCode ?? '' }
    })

    const newPasswordForm = useForm<NewPasswordFormValues>({
        resolver: zodResolver(newPasswordFormSchema),
        defaultValues: { password: '', confirmPassword: '' }
    })

    const [isRequesting, startRequesting] = useTransition()
    const [isVerifying, startVerifying] = useTransition()
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

                setEmail(values.email)
                setDevCode(result.devCode)
                setStep('code')
            } catch (error) {
                console.error(error)
                requestForm.setError('root', {
                    message: authTexts.forgotError
                })
            }
        })
    })

    const handleVerifyCode = codeForm.handleSubmit((values) => {
        startVerifying(async () => {
            try {
                const result = await verifyPasswordResetCode({ email, code: values.code })
                if (!result.success) {
                    codeForm.setError('root', {
                        message: authTexts.invalidOrExpiredCode
                    })
                    return
                }

                setStep('password')
            } catch (error) {
                console.error(error)
                codeForm.setError('root', {
                    message: authTexts.forgotError
                })
            }
        })
    })

    const handleReset = newPasswordForm.handleSubmit((values) => {
        startResetting(async () => {
            try {
                const result = await forgotPasswordReset({
                    email,
                    code: codeForm.getValues('code'),
                    password: values.password
                })

                if (!result.success) {
                    newPasswordForm.setError('root', {
                        message: authTexts.invalidOrExpiredCode
                    })
                    return
                }

                const signInResult = await signIn('credentials', {
                    email,
                    password: values.password,
                    redirect: false
                })

                if (signInResult?.error) {
                    router.push(routes.signIn)
                    return
                }

                router.push(routes.pantry)
            } catch (error) {
                console.error(error)
                newPasswordForm.setError('root', {
                    message: authTexts.forgotError
                })
            }
        })
    })

    return {
        step,
        email,
        devCode,
        request: {
            form: requestForm,
            isSubmitting: isRequesting,
            handleSubmit: handleRequest
        },
        code: {
            form: codeForm,
            isSubmitting: isVerifying,
            handleSubmit: handleVerifyCode
        },
        newPassword: {
            form: newPasswordForm,
            isSubmitting: isResetting,
            handleSubmit: handleReset
        }
    }
}
