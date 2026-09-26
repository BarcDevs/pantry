import { AuthLayout } from '@/components/auth/auth-layout'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

type ForgotPasswordPageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}

const ForgotPasswordPage = async ({ searchParams }: ForgotPasswordPageProps) => {
    const params = await searchParams
    const email = typeof params.email === 'string' ? params.email : undefined
    const code = typeof params.code === 'string' ? params.code : undefined

    return (
        <AuthLayout>
            <ForgotPasswordForm
                initialEmail={email}
                initialCode={code}
            />
        </AuthLayout>
    )
}

export default ForgotPasswordPage
