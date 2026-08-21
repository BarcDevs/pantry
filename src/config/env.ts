import appConfig from '@/config/app'

type Env = {
    clerkPublishableKey: string
    clerkSecretKey: string
    clerkWebhookSecret: string
    mongodbUri: string
    geminiApiKey: string
    geminiModelId: string
    e2eMockAi: boolean
}

const requireVar = (name: string, value: string | undefined) => {
    if (!value) throw new Error(`Missing required env var: ${name}`)
    return value
}

// Exception to "never NEXT_PUBLIC_ prefix": Clerk's SDK requires this exact
// name to read the publishable key client-side - there is no alternative.
const env: Env = {
    clerkPublishableKey: requireVar(
        'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    ),
    clerkSecretKey: requireVar('CLERK_SECRET_KEY', process.env.CLERK_SECRET_KEY),
    clerkWebhookSecret: requireVar('CLERK_WEBHOOK_SECRET', process.env.CLERK_WEBHOOK_SECRET),
    mongodbUri: requireVar('MONGODB_URI', process.env.MONGODB_URI),
    geminiApiKey: requireVar('GEMINI_API_KEY', process.env.GEMINI_API_KEY),
    geminiModelId: process.env.GEMINI_MODEL_ID ?? appConfig.defaultAiModelId,
    e2eMockAi: process.env.E2E_MOCK_AI === 'true' && process.env.NODE_ENV !== 'production'
}

export default env
