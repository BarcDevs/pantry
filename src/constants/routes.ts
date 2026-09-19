export const routes = {
    landing: '/',
    signIn: '/sign-in',
    signUp: '/sign-up',
    forgotPassword: '/forgot-password',
    pantry: '/pantry',
    add: '/add',
    addItemPrefilled: (
        name: string,
        quantity: number,
        unit: string,
        returnTo?: string
    ) => `/add?${new URLSearchParams({
        name,
        quantity: String(quantity),
        unit,
        ...(returnTo ? { returnTo } : {})
    })}`,
    addReceipt: '/add/receipt',
    addPaste: '/add/paste',
    generate: '/generate',
    generateResult: '/generate/result',
    recipes: '/recipes',
    recipeImport: '/recipes/import',
    recipeDetail: (id: string) => `/recipes/${id}`,
    recipeCook: (id: string) => `/recipes/${id}/cook`,
    recipeDeduct: (id: string) => `/recipes/${id}/deduct`,
    recipeRate: (id: string) => `/recipes/${id}/rate`,
    history: '/history',
    settings: '/settings',
    onboarding: '/onboarding'
} as const
