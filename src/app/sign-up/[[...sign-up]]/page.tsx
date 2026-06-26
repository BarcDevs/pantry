import { SignUp } from '@clerk/nextjs'

import { AuthLayout } from '@/components/auth/auth-layout'

import { routes } from '@/constants/routes'

const SignUpPage = () => (
    <AuthLayout>
        <SignUp fallbackRedirectUrl={routes.pantry}/>
    </AuthLayout>
)

export default SignUpPage
