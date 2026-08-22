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
    recipes: '/recipes',
    recipeDetail: (id: string) => `/recipes/${id}`,
    recipeCook: (id: string) => `/recipes/${id}/cook`,
    recipeDeduct: (id: string) => `/recipes/${id}/deduct`,
    recipeRate: (id: string) => `/recipes/${id}/rate`,
    history: '/history',
    settings: '/settings',
    onboarding: '/onboarding'
} as const
