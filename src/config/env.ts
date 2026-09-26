import appConfig from '@/config/app'

type Env = {
    authSecret: string
    googleClientId: string
    googleClientSecret: string
    mongodbUri: string
    geminiApiKey: string
    geminiModelId: string
    geminiImageSearchModelId: string
    youcomApiKey?: string
    e2eMockAi: boolean
    e2eMockSearch: boolean
}

const requireVar = (name: string, value: string | undefined) => {
    if (!value) throw new Error(`Missing required env var: ${name}`)
    return value
}

const env: Env = {
    authSecret: requireVar('AUTH_SECRET', process.env.AUTH_SECRET),
    googleClientId: requireVar('GOOGLE_CLIENT_ID', process.env.GOOGLE_CLIENT_ID),
    googleClientSecret: requireVar('GOOGLE_CLIENT_SECRET', process.env.GOOGLE_CLIENT_SECRET),
    mongodbUri: requireVar('MONGODB_URI', process.env.MONGODB_URI),
    geminiApiKey: requireVar('GEMINI_API_KEY', process.env.GEMINI_API_KEY),
    geminiModelId: process.env.GEMINI_MODEL_ID ?? appConfig.defaultAiModelId,
    geminiImageSearchModelId: process.env.GEMINI_IMAGE_SEARCH_MODEL_ID
        ?? appConfig.defaultImageSearchModelId,
    youcomApiKey: process.env.YOUCOM_API_KEY || undefined,
    e2eMockAi: process.env.E2E_MOCK_AI === 'true' && process.env.NODE_ENV !== 'production',
    e2eMockSearch: process.env.E2E_MOCK_SEARCH === 'true' && process.env.NODE_ENV !== 'production'
}

export default env
