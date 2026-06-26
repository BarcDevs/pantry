import { SignIn } from '@clerk/nextjs'

import { AuthLayout } from '@/components/auth/auth-layout'

import { routes } from '@/constants/routes'

const SignInPage = () => (
    <AuthLayout>
        <SignIn fallbackRedirectUrl={routes.pantry}/>
    </AuthLayout>
)

export default SignInPage
