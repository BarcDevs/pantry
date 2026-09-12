import appConfig from '@/config/app'

type Env = {
    authSecret: string
    googleClientId: string
    googleClientSecret: string
    mongodbUri: string
    geminiApiKey: string
    geminiModelId: string
    e2eMockAi: boolean
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
    e2eMockAi: process.env.E2E_MOCK_AI === 'true' && process.env.NODE_ENV !== 'production'
}

export default env
