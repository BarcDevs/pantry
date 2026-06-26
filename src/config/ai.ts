import { createGoogleGenerativeAI } from '@ai-sdk/google'

import appConfig from '@/config/app'
import env from '@/config/env'

const google = createGoogleGenerativeAI({
    apiKey: env.geminiApiKey
})

export const aiModel = google(appConfig.aiModelId)
