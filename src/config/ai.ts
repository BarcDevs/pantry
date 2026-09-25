import { createGoogleGenerativeAI } from '@ai-sdk/google'

import env from '@/config/env'

export const google = createGoogleGenerativeAI({
    apiKey: env.geminiApiKey
})

export const aiModel = google(env.geminiModelId)
