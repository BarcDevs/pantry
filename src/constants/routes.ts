export const routes = {
    landing: '/',
    signIn: '/sign-in',
    signUp: '/sign-up',
    ssoCallback: '/sso-callback',
    forgotPassword: '/forgot-password',
    pantry: '/pantry',
    add: '/add',
    generate: '/generate',
    generateResult: '/generate/result',
    library: '/library',
    recipeCook: (id: string) => `/recipes/${id}/cook`,
    history: '/history',
    settings: '/settings',
    onboarding: '/onboarding'
} as const
